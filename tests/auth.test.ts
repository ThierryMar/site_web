import assert from 'node:assert/strict'
import test from 'node:test'
import type { CollectionBeforeChangeHook } from 'payload'
import { Users } from '../src/collections/Users'
import { validEmail, validPassword } from '../src/lib/auth-validation'

test('public REST and first-register cannot create accounts; trusted signup can', async () => {
  const hook = Users.hooks!.beforeChange![0]
  const args = { operation: 'create', data: { email: 'student@example.com' }, req: { user: null, context: {} } } as unknown as Parameters<CollectionBeforeChangeHook>[0]
  await assert.rejects(async () => hook(args))
  args.req.context = { publicSignup: true }
  assert.deepEqual(await hook(args), args.data)
})

test('new passwords have bounded length and emails reject malformed input', () => {
  assert.equal(validPassword('short'), false)
  assert.equal(validPassword('a'.repeat(129)), false)
  assert.equal(validPassword('Une longue phrase secrète'), true)
  for (const email of ['invalid', 'a@', 'a b@example.com', 'a@example.com\n']) assert.equal(validEmail(email), false)
  assert.equal(validEmail('student@example.com'), true)
})

test('recovery links target the frontend and expire after one hour', async () => {
  assert.ok(typeof Users.auth === 'object')
  const recovery = Users.auth.forgotPassword!
  assert.equal(recovery.expiration, 3600000)
  const html = await recovery.generateEmailHTML!({ token: 'abc123' } as Parameters<NonNullable<typeof recovery.generateEmailHTML>>[0])
  assert.ok(html?.includes('/reinitialiser-mot-de-passe?token=abc123'))
  assert.ok(!html?.includes('/admin'))
})

