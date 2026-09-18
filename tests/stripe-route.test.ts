import assert from 'node:assert/strict'
import test from 'node:test'
import Stripe from 'stripe'
import { POST } from '../src/app/api/stripe/webhook/route'

test('webhook fails closed until configured and payment handling exists', async () => {
  const previous = process.env.STRIPE_WEBHOOK_SECRET
  const body = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed', data: { object: {} } })
  const request = (signature?: string) => new Request('http://localhost/api/stripe/webhook', {
    method: 'POST', body, headers: signature ? { 'stripe-signature': signature } : {},
  })
  try {
    delete process.env.STRIPE_WEBHOOK_SECRET
    assert.equal((await POST(request())).status, 503)
    const secret = 'whsec_local_test_only'
    process.env.STRIPE_WEBHOOK_SECRET = secret
    assert.equal((await POST(request())).status, 400)
    assert.equal((await POST(request('invalid'))).status, 400)
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret })
    assert.equal((await POST(request(signature))).status, 501)
  } finally {
    if (previous === undefined) delete process.env.STRIPE_WEBHOOK_SECRET
    else process.env.STRIPE_WEBHOOK_SECRET = previous
  }
})
