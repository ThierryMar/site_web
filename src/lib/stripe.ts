import 'server-only'
import Stripe from 'stripe'

let client: Stripe | undefined
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Stripe is not configured: set STRIPE_SECRET_KEY.')
  client ??= new Stripe(key, { maxNetworkRetries: 2 })
  return client
}
