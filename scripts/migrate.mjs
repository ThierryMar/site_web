import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const result = spawnSync(process.execPath, [
  fileURLToPath(new URL('../node_modules/payload/bin.js', import.meta.url)),
  process.argv[2] || 'migrate',
  ...process.argv.slice(3),
], { stdio: 'inherit', env: { ...process.env, PAYLOAD_MIGRATING: 'true' } })
if (result.error) console.error(result.error.message)
process.exit(result.status ?? 1)
