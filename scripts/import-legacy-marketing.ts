import nextEnv from '@next/env'
import { getPayload } from 'payload'
import type { Page, Intro, CourseOverview } from '../src/payload-types'
import manifest from '../src/content/legacy-marketing.json'

nextEnv.loadEnvConfig(process.cwd())
const apply = process.argv.includes('--apply')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

try {
  for (const entry of [manifest.introduction.page, manifest.courses.page]) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: entry.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 })
    if (existing.docs.length) { console.log(`Preserved: page ${entry.slug}`); continue }
    if (apply) await payload.create({ collection: 'pages', overrideAccess: true, data: { ...entry, content: entry.content as Page['content'], _status: 'published' } })
    console.log(`${apply ? 'Imported' : 'Would import'}: page ${entry.slug}`)
  }
  for (const entry of manifest.introduction.sections) {
    const existing = await payload.find({ collection: 'intro', where: { slug: { equals: entry.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 })
    if (existing.docs.length) { console.log(`Preserved: intro ${entry.slug}`); continue }
    if (apply) await payload.create({ collection: 'intro', overrideAccess: true, data: { ...entry, content: entry.content as Intro['content'], _status: 'published' } })
    console.log(`${apply ? 'Imported' : 'Would import'}: intro ${entry.slug}`)
  }
  for (const entry of manifest.courses.sections) {
    const existing = await payload.find({ collection: 'course-overviews', where: { slug: { equals: entry.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 })
    if (existing.docs.length) { console.log(`Preserved: course overview ${entry.slug}`); continue }
    const courses = await payload.find({ collection: 'courses', where: { slug: { equals: entry.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 })
    let course = courses.docs[0]
    if (!course) {
      if (apply) course = await payload.create({ collection: 'courses', overrideAccess: true, data: { title: entry.title, slug: entry.slug, order: entry.order, _status: 'draft' } })
      console.log(`${apply ? 'Imported' : 'Would import'}: private draft course ${entry.slug}`)
    }
    if (apply) await payload.create({ collection: 'course-overviews', overrideAccess: true, data: { ...entry, content: entry.content as CourseOverview['content'], course: course.id, _status: 'published' } })
    console.log(`${apply ? 'Imported' : 'Would import'}: course overview ${entry.slug}`)
  }
  if (!apply) console.log('Read-only preview. Use --apply to create missing records; existing drafts and published records are preserved.')
} finally {
  await payload.destroy()
}
process.exit(0)
