import assert from 'node:assert/strict'
import test from 'node:test'
import { coeSections } from '../src/content/coe-exercises'
import { coeCorrections } from '../src/content/coe-corrections'
import { coeProgress, type CoeAnswers } from '../src/lib/coe-progress'

test('every exercise has a provisional answer and valid choice indices', () => {
  assert.equal(coeCorrections.length, coeSections.length)
  coeSections.forEach((section, s) => {
    assert.equal(coeCorrections[s].length, section.questions.length)
    section.questions.forEach((question, q) => {
      const key = coeCorrections[s][q]
      assert.ok(key.answer.trim() && key.explanation.trim())
      if (question.choices) {
        assert.ok(key.choices?.length)
        assert.ok(key.choices.every(i => i >= 0 && i < question.choices!.length))
        if (!question.multiple) assert.equal(key.choices.length, 1)
      } else assert.equal(key.choices, undefined)
    })
  })
})

test('corrections unlock only with valid answers to every actual question', () => {
  const answers: CoeAnswers = {}
  assert.equal(coeProgress(answers).complete, false)
  coeSections.forEach((section, s) => section.questions.forEach((question, q) => {
    answers[`${s}-${q}`] = question.choices ? [0] : 'My calculation'
  }))
  assert.equal(coeProgress(answers).complete, true)
  answers['fake'] = 'does not count'
  answers['0-0'] = []
  assert.equal(coeProgress(answers).complete, false)
  answers['0-0'] = [99]
  assert.equal(coeProgress(answers).complete, false)
  answers['0-0'] = [0, 1]
  assert.equal(coeProgress(answers).complete, false)
  answers['0-0'] = [0]
  answers['8-0'] = '   '
  assert.equal(coeProgress(answers).complete, false)
})

test('state-vector solutions satisfy vis-viva and eccentricity identities independently', () => {
  const mu = 398600.4415
  const a = 9117.10055946982
  const e = 0.09683993664116408
  assert.ok(Math.abs(mu * (2 / 10000 - 1 / a) - 36) < 1e-10)
  assert.ok(Math.abs(mu * a * (1 - e * e) - 60000 ** 2) < 1e-5)
  assert.ok(Math.abs(a * (1 + e) - 10000) < 1e-8)
  assert.match(coeCorrections[12][6].answer, /270/)
  assert.match(coeCorrections[13][3].answer, /0\.0001368/)
  assert.match(coeCorrections[13][4].answer, /undefined/)
})
