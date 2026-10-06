import assert from 'node:assert/strict'
import test from 'node:test'
import { accountTranslator, resolveAccountLocale } from '../src/lib/account-locale'

test('account language follows supported browser preferences and quality weights', () => {
  for (const [header, expected] of [
    ['en-CA,en;q=0.9,fr;q=0.8', 'en'],
    ['fr-CA,fr;q=0.9,en;q=0.8', 'fr'],
    ['fr;q=0.5,en-GB;q=0.9', 'en'],
    ['de-DE,fr;q=0.8,en;q=0.5', 'fr'],
    ['fr;q=0,en;q=1', 'en'],
    ['fr;q=invalid', 'en'],
    ['es-ES', 'en'],
    [null, 'en'],
  ] as const) assert.equal(resolveAccountLocale(header), expected)
})

test('account translations cover form, profile and validation messages', () => {
  const en = accountTranslator('en')
  const fr = accountTranslator('fr')
  assert.equal(en('Se connecter'), 'Sign in')
  assert.equal(en('Mon compte'), 'My account')
  assert.equal(en('Les mots de passe ne correspondent pas.'), 'The passwords do not match.')
  assert.equal(fr('Mon compte'), 'Mon compte')
})
