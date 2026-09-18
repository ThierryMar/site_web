import nextEnv from '@next/env'
const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())
const failures = []
const required = ['PAYLOAD_SECRET', 'DATABASE_URL', 'NEXT_PUBLIC_SERVER_URL']
for (const key of required) if (!process.env[key]) failures.push(key + ' is missing')
if (process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET.length < 32) failures.push('PAYLOAD_SECRET must contain at least 32 characters')
for (const key of ['DATABASE_URL', 'DATABASE_URL_UNPOOLED']) {
  if (process.env[key]) {
    try {
      const url = new URL(process.env[key])
      if (!['postgres:', 'postgresql:'].includes(url.protocol)) failures.push(key + ' must be a PostgreSQL URL')
      if (url.hostname.endsWith('.neon.tech') && url.searchParams.get('sslmode') !== 'require') failures.push(key + ' must use sslmode=require for Neon')
    } catch { failures.push(key + ' must be a valid URL') }
  }
}
if (process.env.NEXT_PUBLIC_SERVER_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SERVER_URL)
    if (!['http:', 'https:'].includes(url.protocol)) failures.push('NEXT_PUBLIC_SERVER_URL must be an HTTP(S) URL')
    if (url.hostname !== 'localhost' && url.protocol !== 'https:') failures.push('Use HTTPS outside localhost')
  } catch { failures.push('NEXT_PUBLIC_SERVER_URL must be a valid URL') }
}
const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
if (ga && !/^G-[A-Z0-9]+$/.test(ga)) failures.push('NEXT_PUBLIC_GA_MEASUREMENT_ID must be a GA4 measurement ID')
for (const key of ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_GA_MEASUREMENT_ID']) {
  console.log(key + ': ' + (process.env[key] ? 'configured' : 'optional, not configured'))
}
if (failures.length) {
  for (const message of failures) console.error(message)
  process.exitCode = 1
} else console.log('Required configuration is present. Connections have not been tested.')
