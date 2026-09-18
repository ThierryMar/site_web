import nextEnv from '@next/env'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import { downloadsPage, legacyDownloads, legacyDownloadUrl } from '../src/content/legacy-downloads'

nextEnv.loadEnvConfig(process.cwd())
const apply = process.argv.includes('--apply')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

try {
  // Verify the complete asset set before any database writes.
  for (const resource of legacyDownloads) {
    await access(path.resolve('public', 'legacy', resource.directory, resource.filename))
  }
  for (const resource of legacyDownloads) {
    const existing = await payload.find({
      collection: 'downloads', where: { slug: { equals: resource.slug } },
      overrideAccess: true, draft: true, limit: 1, depth: 0,
    })
    if (existing.docs.length) {
      console.log(`Preserved: ${resource.slug}`)
      continue
    }
    if (apply) {
      const { title, slug, order, description, format } = resource
      await payload.create({
        collection: 'downloads', overrideAccess: true,
        data: { title, slug, order, description, format, downloadUrl: legacyDownloadUrl(resource), _status: 'published' },
      })
    }
    console.log(`${apply ? 'Imported' : 'Would import'}: ${resource.slug}`)
  }
  const existingPage = await payload.find({
    collection: 'pages', where: { slug: { equals: downloadsPage.slug } },
    overrideAccess: true, draft: true, limit: 1, depth: 0,
  })
  if (existingPage.docs.length) console.log('Preserved: downloads page')
  else {
    if (apply) await payload.create({ collection: 'pages', overrideAccess: true, data: { ...downloadsPage, _status: 'published' } })
    console.log(`${apply ? 'Imported' : 'Would import'}: downloads page`)
  }
  if (!apply) console.log('Read-only preview. Run with --apply to import missing content. Existing drafts and published records are never overwritten.')
} finally {
  await payload.destroy()
}
// Payload plugins may keep background handles alive after their database pool is closed.
process.exit(0)
