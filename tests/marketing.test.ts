import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import type { Payload } from 'payload'
import manifest from '../src/content/legacy-marketing.json'
import { readPublicMarketing } from '../src/lib/public-marketing'

function richText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const value = node as { text?: string; children?: unknown[]; root?: unknown }
  return value.text ?? (value.root ? richText(value.root) : value.children?.map(richText).join(' ') ?? '')
}

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

test('every legacy introduction and course section retains its text, order and anchor', async () => {
  for (const [filename, data] of [['introduction.html', manifest.introduction], ['courses.html', manifest.courses]] as const) {
    const source = await readFile(`index.html/${filename}`, 'utf8')
    const article = source.match(/<article class="article-principal">([\s\S]*?)<\/article>/)![1]
    const sections = [...article.matchAll(/<section id="([^"]+)">([\s\S]*?)<\/section>/g)]
    assert.equal(data.sections.length, sections.length)
    sections.forEach(([,, html], index) => {
      const record = data.sections[index]
      const original = normalize(html.replace(/<!--[\s\S]*?-->/g, '').replace(/<p class="surtitre[^"]*">[\s\S]*?<\/p>/g, '').replace(/<[^>]+>/g, ' '))
      const summary = 'summary' in record ? String(record.summary) : ''
      assert.equal(normalize(`${record.title} ${summary} ${richText(record.content)}`), original, record.slug)
      assert.equal(record.slug, sections[index][1])
    })
  }
})

test('marketing reads enforce anonymous published-only access without expanding private courses', async () => {
  for (const slug of ['introduction', 'courses'] as const) {
    const requests: Record<string, unknown>[] = []
    const payload = { find: async (options: Record<string, unknown>) => { requests.push(options); return { docs: [] } } } as unknown as Pick<Payload, 'find'>
    assert.deepEqual(await readPublicMarketing(payload, slug), { sections: [], page: null })
    assert.equal(requests.length, 2)
    for (const request of requests) {
      assert.equal(request.overrideAccess, false)
      assert.equal(request.user, null)
      assert.equal(request.draft, false)
      assert.equal(request.depth, 0)
      assert.match(JSON.stringify(request.where), /"_status":\{"equals":"published"\}/)
    }
    assert.equal(requests[0].collection, slug === 'courses' ? 'course-overviews' : 'intro')
    assert.equal(requests[0].pagination, false)
  }
})
