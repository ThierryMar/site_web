import nextEnv from '@next/env'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { getPayload } from 'payload'
import { legacyDownloads } from '../src/content/legacy-downloads'

nextEnv.loadEnvConfig(process.cwd())
const resource = legacyDownloads.find((item) => item.slug === 'orbits101')!
// The GitHub archive is already public and can be used without an app deployment.
const downloadUrl = `https://raw.githubusercontent.com/ThierryMar/site_web/main/index.html/${resource.directory}/${encodeURIComponent(resource.filename)}`
const apply = process.argv.includes('--apply')

// Verify the public archive before changing the shared production database.
if (apply) {
  const response = await fetch(downloadUrl)
  if (!response.ok) throw new Error(`The GitHub archive is unavailable (HTTP ${response.status}).`)
  const local = await readFile(path.join('public', 'legacy', resource.directory, resource.filename))
  const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
  if (hash(local) !== hash(new Uint8Array(await response.arrayBuffer()))) {
    throw new Error('The GitHub archive does not match the replacement file.')
  }
}

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const result = await payload.find({
    collection: 'downloads', where: { slug: { equals: resource.slug } },
    overrideAccess: true, draft: true, limit: 2, depth: 0,
  })
  if (result.docs.length !== 1) throw new Error('Expected exactly one Orbits101 resource.')
  const current = result.docs[0]
  if (current._status !== 'published') throw new Error('Orbits101 has an unpublished draft; review it before replacing the file.')
  const data = { downloadUrl, format: resource.format, description: resource.description }
  console.log(JSON.stringify({ id: current.id, before: { downloadUrl: current.downloadUrl, format: current.format }, after: data }, null, 2))
  if (apply) {
    await payload.update({ collection: 'downloads', id: current.id, overrideAccess: true, data })
    console.log('Orbits101 download updated.')
  } else console.log('Preview only. Run with --apply to publish the verified GitHub download.')
} finally {
  await payload.destroy()
}
process.exit(0)
