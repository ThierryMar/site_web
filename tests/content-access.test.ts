import assert from 'node:assert/strict'
import test from 'node:test'
import type { PayloadRequest } from 'payload'
import { Intro, CourseOverviews, Downloads, Simulations } from '../src/collections/Marketing'
import { Courses, Lessons, CourseResources, Exercises, Quizzes } from '../src/collections/Courses'

const marketing = [Intro, CourseOverviews, Downloads, Simulations]
const learning = [Courses, Lessons, CourseResources, Exercises, Quizzes]
const request = (collection?: string) => ({ req: { user: collection ? { id: 1, collection } : null } as PayloadRequest })

test('public and student requests only see published marketing content and cannot change it', async () => {
  for (const collection of marketing) {
    for (const role of [undefined, 'users']) {
      assert.deepEqual(await collection.access?.read?.(request(role)), { _status: { equals: 'published' } })
      for (const operation of ['create', 'update', 'delete', 'readVersions'] as const) {
        assert.equal(await collection.access?.[operation]?.(request(role)), false)
      }
    }
  }
})

test('course writes and versions stay admin-only, and anonymous readers cannot access material', async () => {
  for (const collection of learning) {
    assert.equal(await collection.access?.read?.(request()), false)
    for (const operation of ['create', 'update', 'delete', 'readVersions'] as const) {
      for (const role of [undefined, 'users']) {
        assert.equal(await collection.access?.[operation]?.(request(role)), false)
      }
      assert.equal(await collection.access?.[operation]?.(request('admins')), true)
    }
  }
})

test('participants can only read the published example course and its published lessons and quiz', async () => {
  assert.deepEqual(await Courses.access?.read?.(request('users')), { and: [{ _status: { equals: 'published' } }, { slug: { equals: 'course-2' } }] })
  for (const collection of [Lessons, Quizzes]) assert.deepEqual(await collection.access?.read?.(request('users')), { and: [
    { _status: { equals: 'published' } }, { 'course.slug': { equals: 'course-2' } }, { 'course._status': { equals: 'published' } },
  ] })
  for (const collection of [Exercises, CourseResources]) assert.equal(await collection.access?.read?.(request('users')), false)
})

test('administrators can read marketing drafts and manage content', async () => {
  for (const collection of marketing) {
    for (const operation of ['read', 'create', 'update', 'delete', 'readVersions'] as const) {
      assert.equal(await collection.access?.[operation]?.(request('admins')), true)
    }
  }
})
