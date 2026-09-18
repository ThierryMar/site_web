import assert from 'node:assert/strict'
import test from 'node:test'
import Stripe from 'stripe'
import { verifyStripeWebhook } from '../src/lib/stripe-webhook'

const secret = 'whsec_local_test_only'
const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed', data: { object: {} } })
test('accepts an authentic Stripe signature', () => {
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret })
  assert.equal(verifyStripeWebhook(payload, header, secret).id, 'evt_test')
})
test('rejects a changed body and the wrong secret', () => {
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret })
  assert.throws(() => verifyStripeWebhook(payload + ' ', header, secret))
  assert.throws(() => verifyStripeWebhook(payload, header, 'whsec_wrong'))
})
test('rejects an expired signature', () => {
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret, timestamp: 1 })
  assert.throws(() => verifyStripeWebhook(payload, header, secret))
})
