import type { Access, AccessResult } from 'payload'
import { exampleCourseSlug } from './lib/course-catalog'

export const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'
export const adminOrSelf: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection === 'users') return { id: { equals: req.user.id } }
  return false
}

export const readExampleCourse: Access = ({ req }): AccessResult => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { and: [{ _status: { equals: 'published' } }, { slug: { equals: exampleCourseSlug } }] }
}

export const readExampleMaterial: Access = ({ req }): AccessResult => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { and: [
    { _status: { equals: 'published' } },
    { 'course.slug': { equals: exampleCourseSlug } },
    { 'course._status': { equals: 'published' } },
  ] }
}
