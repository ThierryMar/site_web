import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'
import nextEnv from '@next/env'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig, getPayload, type Payload } from 'payload'
import { Users } from '../src/collections/Users'
import { resendVerification } from '../src/lib/resend-verification'

nextEnv.loadEnvConfig(process.cwd())
// Every run gets its own schema. Never push the application's public schema.
const schema = `auth_test_${randomBytes(8).toString('hex')}`
assert.match(schema, /^auth_test_[a-f0-9]{16}$/)
const require = createRequire(import.meta.url)
const { Client } = createRequire(require.resolve('@payloadcms/db-postgres'))('pg')
const client = new Client({ connectionString: process.env.DATABASE_URL })
const messages: { html: string; to: unknown }[] = []
let rejectEmail = false
let payload: Payload | undefined
const email = 'auth-integration@example.invalid'
const password = randomBytes(24).toString('hex')
const newPassword = randomBytes(24).toString('hex')
const tokenFromLastEmail = () => {
  const token = messages.at(-1)?.html.match(/token=([a-f0-9]{40})/)?.[1]
  assert.ok(token, 'Email must contain a usable frontend token')
  return token
}

try {
  await client.connect()
  await client.query(`CREATE SCHEMA "${schema}"`)
  payload = await getPayload({ config: buildConfig({
    secret: randomBytes(32).toString('hex'),
    serverURL: 'http://localhost:3000',
    admin: { user: 'users' },
    collections: [Users],
    db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL, max: 3 }, schemaName: schema, push: true }),
    typescript: { autoGenerate: false },
    email: () => ({ name: 'test-capture', defaultFromAddress: 'test@example.invalid', defaultFromName: 'Test',
      sendEmail: async message => {
        if (rejectEmail) throw new Error('Simulated email outage')
        messages.push({ html: String(message.html), to: message.to })
        return { id: 'captured-locally' }
      },
    }),
  }) })
  const user = await payload.create({ collection: 'users', context: { publicSignup: true }, data: { email, password, _verified: true } })
  assert.equal(user._verified, false, 'Public signup cannot self-verify')
  assert.equal(messages.length, 1)
  assert.match(messages[0].html, /\/confirmer-courriel\?token=/)
  const originalToken = tokenFromLastEmail()
  await assert.rejects(payload.login({ collection: 'users', data: { email, password } }))
  const unverifiedReset = await payload.forgotPassword({ collection: 'users', data: { email } })
  assert.ok(unverifiedReset)
  await assert.rejects(payload.resetPassword({ collection: 'users', data: { token: unverifiedReset, password: newPassword }, overrideAccess: true }))
  console.log('PASS: unverified login/reset rejected; verification email captured')

  const beforeResend = messages.length
  await resendVerification(payload, email)
  assert.equal(messages.length, beforeResend, 'One-minute resend cooldown')
  await payload.db.updateOne({ collection: 'users', id: user.id, data: { verificationEmailSentAt: new Date(0).toISOString() } })
  await resendVerification(payload, email)
  assert.equal(messages.length, beforeResend + 1)
  const verificationToken = tokenFromLastEmail()
  assert.notEqual(verificationToken, originalToken)
  await assert.rejects(payload.verifyEmail({ collection: 'users', token: originalToken }))
  assert.equal(await payload.verifyEmail({ collection: 'users', token: verificationToken }), true)
  await assert.rejects(payload.verifyEmail({ collection: 'users', token: verificationToken }))
  const login = await payload.login({ collection: 'users', data: { email, password } })
  assert.ok(login.token)
  const claims = JSON.parse(Buffer.from(login.token.split('.')[1], 'base64url').toString())
  assert.equal(claims.exp - claims.iat, 30 * 24 * 60 * 60, 'Login remains valid for 30 days')
  const sessionUser = await payload.findByID({ collection: 'users', id: user.id, showHiddenFields: true })
  const session = sessionUser.sessions?.find(item => item.id === claims.sid)
  assert.ok(session, 'Persistent token must have a revocable database session')
  assert.ok(Math.abs(new Date(session.expiresAt).getTime() - claims.exp * 1000) < 2000, 'Database session and token expire together')
  const headers = new Headers({ Authorization: `JWT ${login.token}` })
  assert.ok((await payload.auth({ headers })).user)
  console.log('PASS: resend cooldown, token rotation, single-use verification and login')

  await payload.update({ collection: 'users', id: user.id, user: { ...login.user, collection: 'users' }, overrideAccess: false,
    data: { email: 'changed@example.invalid', _verified: false, _verificationToken: 'attacker', verificationEmailSentAt: new Date(0).toISOString() } })
  const protectedUser = await payload.findByID({ collection: 'users', id: user.id, overrideAccess: false, user: { ...login.user, collection: 'users' }, showHiddenFields: true })
  assert.equal(protectedUser.email, email)
  assert.equal(protectedUser._verified, true)
  assert.equal(protectedUser._verificationToken, undefined)
  assert.equal(protectedUser.verificationEmailSentAt, undefined)
  console.log('PASS: student cannot change email, verification state or protected fields')

  const expiredToken = await payload.forgotPassword({ collection: 'users', data: { email } })
  assert.ok(expiredToken)
  await payload.update({ collection: 'users', id: user.id, data: { resetPasswordExpiration: new Date(0).toISOString() } })
  await assert.rejects(payload.resetPassword({ collection: 'users', data: { token: expiredToken, password: newPassword }, overrideAccess: true }))
  const token = await payload.forgotPassword({ collection: 'users', data: { email } })
  assert.ok(token)
  assert.match(messages.at(-1)!.html, /\/reinitialiser-mot-de-passe\?token=/)
  assert.equal(tokenFromLastEmail(), token)
  await assert.rejects(payload.resetPassword({ collection: 'users', data: { token, password: 'short' }, overrideAccess: true }))
  const reset = await payload.resetPassword({ collection: 'users', data: { token, password: newPassword }, overrideAccess: true })
  assert.equal(reset.token, undefined)
  assert.equal((await payload.auth({ headers })).user, null)
  await assert.rejects(payload.resetPassword({ collection: 'users', data: { token, password }, overrideAccess: true }))
  await assert.rejects(payload.login({ collection: 'users', data: { email, password } }))
  assert.ok((await payload.login({ collection: 'users', data: { email, password: newPassword } })).token)
  console.log('PASS: expiration, password policy, single-use reset, session revocation, new password')

  const messageCount = messages.length
  assert.equal(await payload.forgotPassword({ collection: 'users', data: { email: 'absent@example.invalid' } }), null)
  await resendVerification(payload, 'absent@example.invalid')
  await resendVerification(payload, email)
  assert.equal(messages.length, messageCount)
  rejectEmail = true
  await assert.rejects(payload.create({ collection: 'users', context: { publicSignup: true }, data: { email: 'outage@example.invalid', password } }))
  assert.equal((await payload.count({ collection: 'users', where: { email: { equals: 'outage@example.invalid' } } })).totalDocs, 0)
  console.log('PASS: absent/verified accounts do not receive verification mail; email outage rolls signup back')
} finally {
  if (payload) await payload.destroy()
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await client.end()
  console.log('Isolated authentication test schema removed; no external email sent.')
}
// Payload's development schema watcher can keep the process alive after cleanup.
process.exit(0)
