'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { gradePractice, type PracticeResult } from '@/lib/grade-practice'
import { exampleCourseSlug } from '@/lib/course-catalog'

export async function checkPractice(quizId: number, selections: unknown): Promise<PracticeResult> {
  if (!Number.isSafeInteger(quizId) || quizId < 1) return { error: 'Invalid self-check.' }
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.collection !== 'users') return { error: 'Sign in to check your responses.' }
  // First enforce the participant's published-course access. Never trust a client course ID.
  const permitted = await payload.find({ collection: 'quizzes', user, overrideAccess: false, draft: false, depth: 0, limit: 1,
    where: { and: [{ id: { equals: quizId } }, { slug: { equals: 'astrodynamics-laws-self-check' } }, { 'course.slug': { equals: exampleCourseSlug } }] },
  })
  if (!permitted.docs.length) return { error: 'This self-check is unavailable.' }
  // Only this explicitly public-to-participants practice quiz discloses corrections.
  // Generic quiz answer fields remain admin-only through REST, GraphQL and the Local API.
  const quiz = await payload.findByID({ collection: 'quizzes', id: quizId, overrideAccess: true, draft: false, depth: 0 })
  if (quiz._status !== 'published') return { error: 'This self-check is unavailable.' }
  return gradePractice(quiz, selections)
}
