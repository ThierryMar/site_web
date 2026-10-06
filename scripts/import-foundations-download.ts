import nextEnv from '@next/env'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import { legacyDownloads } from '../src/content/legacy-downloads'

nextEnv.loadEnvConfig(process.cwd())
const resource = legacyDownloads.find((item) => item.slug === 'sol-part-ii')!
// The GitHub upload is already public, so publishing this resource needs no app deployment.
const downloadUrl = `https://raw.githubusercontent.com/ThierryMar/site_web/main/index.html/Fichiers/${encodeURIComponent(resource.filename)}`
const apply = process.argv.includes('--apply')
const local = await readFile(`public/legacy/Fichiers/${resource.filename}`)
const response = await fetch(downloadUrl)
if (!response.ok || !local.equals(Buffer.from(await response.arrayBuffer()))) {
  throw new Error('The public GitHub PDF must match the local document before publication.')
}
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const existing = await payload.find({
    collection: 'downloads', where: { slug: { equals: resource.slug } },
    overrideAccess: true, draft: true, limit: 1, depth: 0,
  })
  if (existing.docs.length) console.log('Preserved existing resource:', resource.slug)
  else {
    const { title, slug, order, description, format } = resource
    const data = { title, slug, order, description, format, downloadUrl, _status: 'published' as const }
    if (apply) await payload.create({ collection: 'downloads', overrideAccess: true, data })
    console.log(apply ? 'Published resource:' : 'Would publish resource:', data)
  }
} finally {
  await payload.destroy()
}
process.exit(0)
