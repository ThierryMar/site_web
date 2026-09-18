import { verifyStripeWebhook } from '@/lib/stripe-webhook'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return Response.json({ error: 'Stripe webhook is not configured.' }, { status: 503 })
  const signature = request.headers.get('stripe-signature')
  if (!signature) return Response.json({ error: 'Missing signature.' }, { status: 400 })
  try {
    verifyStripeWebhook(await request.text(), signature, secret)
  } catch {
    return Response.json({ error: 'Invalid signature.' }, { status: 400 })
  }
  // Deliberately do not acknowledge payment events until durable processing exists.
  return Response.json({ error: 'Payment processing is not implemented yet.' }, { status: 501 })
}
