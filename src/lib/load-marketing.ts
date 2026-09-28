import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { readPublicMarketing, type MarketingPage } from './public-marketing'

export async function loadMarketing(slug: MarketingPage) {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return null
  try {
    return await readPublicMarketing(await getPayload({ config }), slug)
  } catch {
    console.error(`[${slug}] Unable to read published CMS content.`)
    return null
  }
}
