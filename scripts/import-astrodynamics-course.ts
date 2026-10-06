import nextEnv from '@next/env'
import { mkdir, writeFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import { astrodynamicsCourse, astrodynamicsLessons, astrodynamicsOverview, astrodynamicsQuiz } from '../src/content/astrodynamics-laws'

nextEnv.loadEnvConfig(process.cwd())
const apply = process.argv.includes('--apply')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

try {
  const [courses, overviews, lessons, quizzes] = await Promise.all([
    payload.find({ collection: 'courses', where: { slug: { equals: astrodynamicsCourse.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 }),
    payload.find({ collection: 'course-overviews', where: { slug: { equals: astrodynamicsCourse.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 }),
    payload.find({ collection: 'lessons', where: { slug: { in: astrodynamicsLessons.map((l) => l.slug) } }, overrideAccess: true, draft: true, pagination: false, depth: 0 }),
    payload.find({ collection: 'quizzes', where: { slug: { equals: astrodynamicsQuiz.slug } }, overrideAccess: true, draft: true, limit: 1, depth: 0 }),
  ])
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', course: courses.docs.map(({ id, title, _status }) => ({ id, title, _status })), overview: overviews.docs.map(({ id, title, _status }) => ({ id, title, _status })), existingLessons: lessons.docs.length, existingQuizzes: quizzes.docs.length, plannedLessons: astrodynamicsLessons.length, minutes: astrodynamicsLessons.reduce((sum, l) => sum + l.durationMinutes, 0) }))
  if (lessons.docs.length || quizzes.docs.length) {
    console.log('Import already present. Existing authored lessons and quizzes are preserved. Edit published content in Payload. No changes made.')
  } else if (apply) {
    await mkdir('output', { recursive: true })
    await writeFile(`output/astrodynamics-before-${Date.now()}.json`, JSON.stringify({ courses: courses.docs, overviews: overviews.docs }, null, 2))
    const transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A transaction is required for this import.')
    const req = { transactionID }
    try {
      const courseData = { ...astrodynamicsCourse, _status: 'published' as const }
      const course = courses.docs[0]
        ? await payload.update({ collection: 'courses', id: courses.docs[0].id, data: courseData, overrideAccess: true, req })
        : await payload.create({ collection: 'courses', data: courseData, overrideAccess: true, req })
      for (const lesson of astrodynamicsLessons) await payload.create({ collection: 'lessons', data: { ...lesson, course: course.id, _status: 'published' }, overrideAccess: true, req })
      await payload.create({ collection: 'quizzes', data: { ...astrodynamicsQuiz, course: course.id, _status: 'published' }, overrideAccess: true, req })
      const overviewData = {
        title: course.title, slug: course.slug, course: course.id, order: 20,
        summary: 'Understand the laws that govern satellite motion. Start with Astrodynamics Laws, the first complete module of Foundations of Astrodynamics.',
        content: astrodynamicsOverview, level: 'beginner' as const, durationMinutes: astrodynamicsLessons.reduce((sum, l) => sum + l.durationMinutes, 0), _status: 'published' as const,
      }
      if (overviews.docs[0]) await payload.update({ collection: 'course-overviews', id: overviews.docs[0].id, data: overviewData, overrideAccess: true, req })
      else await payload.create({ collection: 'course-overviews', data: overviewData, overrideAccess: true, req })
      await payload.db.commitTransaction(transactionID)
      console.log('Published Course II, its abridged overview, nine lessons and one practice quiz. Other courses unchanged.')
    } catch (error) { await payload.db.rollbackTransaction(transactionID); throw error }
  } else console.log('Preview only. Use --apply to publish this module. Existing course and overview are backed up before changes.')
} finally { await payload.destroy() }
process.exit(0)
