import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import type { Payload } from 'payload'
import { isDownloadUrl } from '../src/lib/download-url'
import { legacyDownloads, legacyDownloadUrl } from '../src/content/legacy-downloads'
import { readPublicDownloads } from '../src/lib/public-downloads'

test('downloads reject executable schemes and off-site protocol-relative paths', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//evil.example/file', '/\\evil.example/file', ' /file.pdf', '/file name.pdf', '', null]) {
    assert.equal(isDownloadUrl(value), false, String(value))
  }
  for (const value of ['/legacy/file%20name.pdf', 'https://example.com/file.pdf', 'http://localhost:3000/file.pdf']) {
    assert.equal(isDownloadUrl(value), true)
  }
})

test('all five migrated downloads are byte-identical to the original public files', async () => {
  assert.equal(legacyDownloads.length, 5)
  for (const resource of legacyDownloads) {
    const target = path.join('public', decodeURIComponent(legacyDownloadUrl(resource)))
    await access(target)
    const [original, migrated] = await Promise.all([
      readFile(path.join('index.html', resource.directory, resource.filename)), readFile(target),
    ])
    assert.ok(original.equals(migrated), resource.slug)
    assert.ok(isDownloadUrl(legacyDownloadUrl(resource)))
  }
})

test('public CMS reads enforce anonymous published-only access and preserve an empty catalog', async () => {
  const requests: Record<string, unknown>[] = []
  const payload = {
    find: async (options: Record<string, unknown>) => {
      requests.push(options)
      return { docs: [] }
    },
  } as unknown as Pick<Payload, 'find'>
  assert.deepEqual(await readPublicDownloads(payload), { resources: [], page: null })
  assert.equal(requests.length, 2)
  for (const request of requests) {
    assert.equal(request.overrideAccess, false)
    assert.equal(request.user, null)
    assert.equal(request.draft, false)
    assert.match(JSON.stringify(request.where), /"_status":\{"equals":"published"\}/)
  }
  assert.equal(requests[0].pagination, false)
})
