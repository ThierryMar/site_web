import type { EmailAdapter } from 'payload'

export const transactionalEmail: EmailAdapter = () => ({
  name: 'resend',
  defaultFromAddress: process.env.EMAIL_FROM || 'noreply@example.com',
  defaultFromName: 'SpaceOrbitLAB',
  async sendEmail(message) {
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      throw new Error('Configure RESEND_API_KEY and EMAIL_FROM to send authentication emails.')
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `SpaceOrbitLAB <${process.env.EMAIL_FROM}>`, to: message.to, subject: message.subject, html: message.html, text: message.text }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`Email delivery failed (${response.status})`)
    return response.json()
  },
})
