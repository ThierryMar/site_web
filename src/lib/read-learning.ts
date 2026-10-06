import type { Payload } from 'payload'
import type { User } from '../payload-types'

type Student = User & { collection: 'users' }

export async function readCourses(payload: Pick<Payload, 'find'>, user: Student) {
  return (await payload.find({ collection: 'courses', user, overrideAccess: false, draft: false,
    depth: 0, pagination: false, sort: ['order', 'title'], where: { _status: { equals: 'published' } },
    select: { title: true, slug: true, description: true, objectives: true },
  })).docs
}

export async function readCourse(payload: Pick<Payload, 'find'>, user: Student, slug: string) {
  const course = (await payload.find({ collection: 'courses', user, overrideAccess: false, draft: false,
    depth: 0, limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    select: { title: true, slug: true, description: true, objectives: true },
  })).docs[0]
  if (!course) return null
  const [lessons, quizzes] = await Promise.all([
    payload.find({ collection: 'lessons', user, overrideAccess: false, draft: false, depth: 0, pagination: false,
      sort: ['order', 'title'], where: { and: [{ course: { equals: course.id } }, { _status: { equals: 'published' } }] },
    }),
    payload.find({ collection: 'quizzes', user, overrideAccess: false, draft: false, depth: 0, pagination: false,
      sort: ['order', 'title'], where: { and: [{ course: { equals: course.id } }, { _status: { equals: 'published' } }] },
    }),
  ])
  return { course, lessons: lessons.docs, quizzes: quizzes.docs }
}
