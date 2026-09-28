import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import test from 'node:test'
import templates from '../src/content/legacy-templates.json'

test('historical CSS and simulation code are copied byte-for-byte', async () => {
  for (const name of ['style.css', 'simulations.css', 'simulations.js', 'SOL.py']) {
    const [source, published] = await Promise.all([readFile(`index.html/${name}`), readFile(`public/legacy/${name}`)])
    assert.ok(source.equals(published), name)
  }
})

test('restored templates contain no executable HTML and all local images exist', async () => {
  for (const html of [templates.home, templates.contact, templates.objectives, ...Object.values(templates.headers)]) {
    assert.doesNotMatch(html, /<script\b|\bon\w+\s*=|javascript:/i)
    for (const match of html.matchAll(/src="(\/legacy\/[^"#]+)"/g)) {
      await access(`public${decodeURIComponent(match[1])}`)
    }
  }
  assert.match(templates.home, /href="\/downloads"\s+class="carte-lien"[^]*?<h3>Downloads/)
  assert.doesNotMatch(templates.contact, /sitescours\.monportail/)
})
