import assert from 'node:assert/strict'
import test from 'node:test'
import { coeSections } from '../src/content/coe-exercises'
import { coeCorrections } from '../src/content/coe-corrections'
import { coeProgress, type CoeAnswers } from '../src/lib/coe-progress'
import { coeAnswerFields } from '../src/content/coe-answer-fields'
import { gradeCoe } from '../src/lib/grade-coe'
import { Users } from '../src/collections/Users'

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
    answers[`${s}-${q}`] = question.choices ? [0] : Object.fromEntries(coeAnswerFields[`${s}-${q}`].map(field => [field.id, field.options?.[0] ?? '0']))
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

test('server grading awards 43/43, accepts rounding and detects mistakes across question types', () => {
  const answers: CoeAnswers = {}
  coeSections.forEach((section, s) => section.questions.forEach((question, q) => {
    if (question.choices) answers[`${s}-${q}`] = [...coeCorrections[s][q].choices!]
  }))
  Object.assign(answers, {
    '8-0': { value: '2026,889' }, '8-1': { value: '-26.105' }, '8-2': { value: '54887.722' }, '8-3': { value: '6.536' },
    '9-0': { value: '35793.205' }, '9-1': { value: '-4.727' }, '9-2': { value: '3.075' },
    '10-0': { value: '3.993' }, '10-1': { value: '5.647' }, '10-2': { kinetic: '7.972', potential: '0', mechanical: '7.972' },
    '11-0': { i: '180' }, '11-1': { orbit: 'Circular or equatorial' }, '11-2': { orbit: 'Equatorial' }, '11-3': { element: 'True anomaly ν' },
    '12-0': { location: 'North Pole', apsis: 'Apogee' }, '12-1': { hi: '0', hj: '60000', hk: '0' }, '12-2': { a: '9117.101' }, '12-3': { e: '0.09684' }, '12-4': { i: '90' }, '12-5': { raan: '180' }, '12-6': { omega: '270' }, '12-7': { nu: '180' },
    '13-0': { location: 'Equator along +I', node: 'Descending node' }, '13-1': { gamma: '0' }, '13-2': { hi: '0', hj: '44640', hk: '44640' },
    '13-3': { a: '10000', e: '0', i: '45', raan: '180', omega: 'Undefined (circular interpretation)', nu: 'Undefined (circular interpretation)' },
    '13-4': { location: 'Equator along −J', apsis: 'Perigee', gamma: '0', hi: '0', hj: '0', hk: '63000', a: '12120.731', e: '0.422477', i: '0', raanStatus: 'Undefined', omegaStatus: 'Undefined', nu: '360', longitude: '270' },
  })
  assert.equal(gradeCoe(answers).score, 43)
  assert.equal(gradeCoe(answers).percentage, 100)
  answers['0-0'] = [0]
  answers['2-0'] = [2]
  answers['8-0'] = { value: '500' }
  answers['13-2'] = { hi: '1', hj: '44640', hk: '44640' }
  assert.equal(gradeCoe(answers).score, 39)
  assert.equal(gradeCoe(answers).percentage, 90.7)
  answers['8-0'] = { value: 'not a number' }
  assert.throws(() => gradeCoe(answers))
  assert.throws(() => gradeCoe({}))
})

test('last result cannot be supplied or modified through generic user APIs', () => {
  const field = Users.fields.find(field => 'name' in field && field.name === 'lastCoeResult')
  assert.ok(field && 'access' in field)
  assert.equal(field.access?.create?.({} as never), false)
  assert.equal(field.access?.update?.({} as never), false)
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
