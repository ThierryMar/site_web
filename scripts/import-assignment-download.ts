import nextEnv from '@next/env'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'

nextEnv.loadEnvConfig(process.cwd())
const filename = 'PHY-7012 – Assignment #1 (2026-09-28).pdf'
const downloadUrl = `/downloads/assignments/${encodeURIComponent(filename)}`
const apply = process.argv.includes('--apply')
const local = await readFile(`public/downloads/assignments/${filename}`)
if (apply) {
  const response = await fetch(new URL(downloadUrl, 'https://spaceorbitlab.com'))
  if (!response.ok || !local.equals(Buffer.from(await response.arrayBuffer()))) {
    throw new Error('Deploy the matching assignment PDF before publishing its CMS entry.')
  }
}
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const slug = 'phy-7012-assignment-1-2026-09-28'
  const existing = await payload.find({
    collection: 'downloads', where: { slug: { equals: slug } },
    overrideAccess: true, draft: true, limit: 1, depth: 0,
  })
  if (existing.docs.length) console.log('Preserved existing assignment:', slug)
  else {
    const data = {
      title: 'PHY-7012 – Assignment #1', slug, order: 60,
      description: 'September 28, 2026 edition.', format: 'PDF', downloadUrl,
      _status: 'published' as const,
    }
    if (apply) await payload.create({ collection: 'downloads', overrideAccess: true, data })
    console.log(apply ? 'Published assignment:' : 'Would publish assignment:', data)
  }
} finally {
  await payload.destroy()
}
process.exit(0)
