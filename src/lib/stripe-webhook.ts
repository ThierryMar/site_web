import Stripe from 'stripe'

export function verifyStripeWebhook(body: string, signature: string, secret: string) {
  // Signature validation is local and does not make a Stripe API request.
  return Stripe.webhooks.constructEvent(body, signature, secret)
}
