import assert from 'node:assert/strict'
import test from 'node:test'
import type { Payload } from 'payload'
import type { Quiz, User } from '../src/payload-types'
import { circularOrbit, earthMu } from '../src/lib/orbital-calculations'
import { gradePractice } from '../src/lib/grade-practice'
import { readCourse, readCourses } from '../src/lib/read-learning'

test('circular orbit calculations satisfy independent physical identities and units', () => {
  const leo = circularOrbit(500)
  assert.ok(Math.abs(leo.speed - 7.61656) < 0.0001)
  assert.ok(Math.abs(leo.period / 60 - 94.469) < 0.01)
  assert.ok(Math.abs(leo.speed ** 2 / leo.radius - leo.acceleration) < 1e-12)
  assert.ok(Math.abs(leo.period * leo.speed - 2 * Math.PI * leo.radius) < 1e-8)
  assert.ok(Math.abs(leo.speed ** 2 / 2 - earthMu / leo.radius - leo.energy) < 1e-10)
  const geo = circularOrbit(35786)
  assert.ok(geo.speed < leo.speed && geo.energy > leo.energy && geo.period > leo.period)
  assert.ok(Math.abs(geo.energy + 4.7276) < 0.001)
  for (const altitude of [NaN, Infinity, -1, 199, 40001]) assert.throws(() => circularOrbit(altitude), RangeError)
})

const quiz = { passingScore: 70, questions: [
  { prompt: 'One', choices: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] },
  { prompt: 'Two', choices: [{ text: 'C', isCorrect: false }, { text: 'D', isCorrect: true }] },
] } as Quiz

test('practice grading handles correct, incorrect, missing and manipulated answers', () => {
  const full = gradePractice(quiz, [0, 1])
  assert.ok('score' in full && full.score === 100 && full.passed)
  const half = gradePractice(quiz, [0, 0])
  assert.ok('score' in half && half.score === 50 && !half.passed && half.answers[1].correctChoice === 'D')
  for (const input of [null, {}, [], [0], [0, -1], [0, 2], ['0', 1], [0.5, 1], [0, 1, 0]]) assert.ok('error' in gradePractice(quiz, input))
  const broken = structuredClone(quiz)
  broken.questions[0].choices[1].isCorrect = true
  assert.ok('error' in gradePractice(broken, [0, 1]))
})

test('learning queries enforce participant access and never request drafts or expanded relationships', async () => {
  const calls: Record<string, unknown>[] = []
  const user = { id: 8, collection: 'users' } as User & { collection: 'users' }
  const payload = { find: async (options: Record<string, unknown>) => { calls.push(options); return { docs: options.collection === 'courses' ? [{ id: 2, slug: 'course-2' }] : [] } } } as unknown as Pick<Payload, 'find'>
  await readCourses(payload, user)
  await readCourse(payload, user, 'course-2')
  assert.equal(calls.length, 4)
  for (const call of calls) {
    assert.equal(call.user, user)
    assert.equal(call.overrideAccess, false)
    assert.equal(call.draft, false)
    assert.equal(call.depth, 0)
    assert.match(JSON.stringify(call.where), /"_status":\{"equals":"published"\}/)
  }
  assert.match(JSON.stringify(calls[2].where), /"course":\{"equals":2\}/)
})

test('an inaccessible course never triggers queries for its lessons or quiz', async () => {
  let calls = 0
  const payload = { find: async () => { calls++; return { docs: [] } } } as unknown as Pick<Payload, 'find'>
  const user = { id: 8, collection: 'users' } as User & { collection: 'users' }
  assert.equal(await readCourse(payload, user, 'private-course'), null)
  assert.equal(calls, 1)
})
