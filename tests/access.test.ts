import assert from 'node:assert/strict'
import test from 'node:test'
import type { PayloadRequest } from 'payload'
import { adminOrSelf, isAdmin } from '../src/access'
import { Pages } from '../src/collections/Pages'

function args(user: { id: number; collection: string } | null) {
  return { req: { user } as PayloadRequest }
}
test('anonymous visitors cannot administer or read user records', () => {
  assert.equal(isAdmin(args(null)), false)
  assert.equal(adminOrSelf(args(null)), false)
})
test('students can only access themselves and cannot administer', () => {
  const student = args({ id: 7, collection: 'users' })
  assert.equal(isAdmin(student), false)
  assert.deepEqual(adminOrSelf(student), { id: { equals: 7 } })
  assert.deepEqual(Pages.access?.read?.(student), { _status: { equals: 'published' } })
})
test('administrators can access the CMS and drafts', () => {
  const admin = args({ id: 1, collection: 'admins' })
  assert.equal(isAdmin(admin), true)
  assert.equal(adminOrSelf(admin), true)
  assert.equal(Pages.access?.read?.(admin), true)
})
