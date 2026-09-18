import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { readPublicDownloads } from './public-downloads'

export async function loadDownloads() {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return null
  try {
    return await readPublicDownloads(await getPayload({ config }))
  } catch {
    // Do not expose database connection details or resurrect unpublished legacy content.
    console.error('[downloads] Unable to read published CMS content.')
    return null
  }
}
