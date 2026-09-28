import { randomBytes } from 'node:crypto'
import type { Payload } from 'payload'
import { authEmailHTML, verificationSubject } from './auth-emails'

// Only called server-side with a validated email. Never return account or token data.
export async function resendVerification(payload: Payload, email: string) {
  const token = randomBytes(20).toString('hex')
  const user = await payload.db.updateOne({
    collection: 'users',
    where: { and: [
      { email: { equals: email } },
      { _verified: { equals: false } },
      { or: [
        { verificationEmailSentAt: { exists: false } },
        { verificationEmailSentAt: { less_than: new Date(Date.now() - 60_000).toISOString() } },
      ] },
    ] },
    data: { _verificationToken: token, verificationEmailSentAt: new Date().toISOString() },
  })
  if (!user) return
  await payload.sendEmail({ to: email, subject: verificationSubject, html: authEmailHTML('verify', token) })
}
