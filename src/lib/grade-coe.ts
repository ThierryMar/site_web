import { coeSections } from '../content/coe-exercises'
import { coeCorrections } from '../content/coe-corrections'
import { coeAnswerFields } from '../content/coe-answer-fields'
import { earthMu as mu, earthMeanRadius as radius } from './orbital-calculations'
import { coeProgress, parseCoeNumber, type CoeAnswers } from './coe-progress'

export const coeGradingVersion = 'provisional-2026-10-06-v1'
export type CoeResult = { score: number; total: number; percentage: number; completedAt: string; version: string; answers: CoeAnswers; correct: Record<string, boolean> }
type Expected = number | string[]
const rp = radius + 500, a1 = rp / 0.9, ra = a1 * 1.1
const geoA = Math.cbrt(mu * (23.9345 * 3600 / (2 * Math.PI)) ** 2)
const v2 = 2 * 4.464 ** 2
const expected: Record<string, Record<string, Expected>> = {
  '8-0': { value: ra - radius }, '8-1': { value: -mu / (2 * a1) }, '8-2': { value: Math.sqrt(mu * a1 * 0.99) }, '8-3': { value: Math.sqrt(mu * (2 / ra - 1 / a1)) },
  '9-0': { value: geoA - radius }, '9-1': { value: -mu / (2 * geoA) }, '9-2': { value: Math.sqrt(mu / geoA) },
  '10-0': { value: Math.sqrt(mu / 25000) }, '10-1': { value: Math.sqrt(2 * mu / 25000) }, '10-2': { kinetic: mu / 50000, potential: 0, mechanical: mu / 50000 },
  '11-0': { i: 0 }, '11-1': { orbit: ['Circular', 'Equatorial', 'Circular or equatorial'] }, '11-2': { orbit: ['Equatorial'] }, '11-3': { element: ['True anomaly ν'] },
  '12-0': { location: ['North Pole'], apsis: ['Apogee'] }, '12-1': { hi: 0, hj: 60000, hk: 0 }, '12-2': { a: 1 / (2 / 10000 - 36 / mu) }, '12-3': { e: 1 - 360000 / mu }, '12-4': { i: 90 }, '12-5': { raan: 180 }, '12-6': { omega: 270 }, '12-7': { nu: 180 },
  '13-0': { location: ['Equator along +I'], node: ['Descending node'] }, '13-1': { gamma: 0 }, '13-2': { hi: 0, hj: 44640, hk: 44640 },
  '13-3': { a: 1 / (2 / 10000 - v2 / mu), e: 1 - v2 * 10000 / mu, i: 45, raan: 180, omega: ['0°', 'Undefined (circular interpretation)'], nu: ['180°', 'Undefined (circular interpretation)'] },
  '13-4': { location: ['Equator along −J'], apsis: ['Perigee'], gamma: 0, hi: 0, hj: 0, hk: 63000, a: 1 / (2 / 7000 - 81 / mu), e: 81 * 7000 / mu - 1, i: 0, raanStatus: ['Undefined'], omegaStatus: ['Undefined'], nu: 0, longitude: 270 },
}

export function gradeCoe(raw: unknown, completedAt = new Date().toISOString()): CoeResult {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || JSON.stringify(raw).length > 30000) throw new Error('Invalid answers')
  const answers = raw as CoeAnswers
  if (!coeProgress(answers).complete) throw new Error('Answer every question first')
  const correct: Record<string, boolean> = {}
  const clean: CoeAnswers = {}
  coeSections.forEach((section, s) => section.questions.forEach((question, q) => {
    const key = `${s}-${q}`, answer = answers[key]
    if (question.choices) {
      const selected = answer as number[]
      clean[key] = [...selected]
      const target = coeCorrections[s][q].choices!
      correct[key] = target.length === selected.length && target.every(index => selected.includes(index))
    } else {
      const fields = answer as Record<string, string>
      clean[key] = Object.fromEntries(coeAnswerFields[key].map(field => [field.id, fields[field.id]]))
      correct[key] = coeAnswerFields[key].every(field => {
        const target = expected[key][field.id], value = fields[field.id]
        if (Array.isArray(target)) return target.includes(value)
        const number = parseCoeNumber(value)
        if (key === '11-0') return Math.min(Math.abs(number), Math.abs(number - 180)) <= 0.1
        const angle = field.unit === '°'
        const difference = angle && field.id !== 'i' && field.id !== 'gamma' ? Math.abs(((number - target + 180) % 360 + 360) % 360 - 180) : Math.abs(number - target)
        const tolerance = key === '13-3' && field.id === 'e' ? 0.0002 : angle ? 0.1 : Math.max(Math.abs(target) * 0.01, 0.001)
        return difference <= tolerance
      })
    }
  }))
  const score = Object.values(correct).filter(Boolean).length, total = Object.keys(correct).length
  return { score, total, percentage: Math.round(score / total * 1000) / 10, completedAt, version: coeGradingVersion, answers: clean, correct }
}

export function readCoeResult(value: unknown): CoeResult | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const result = value as CoeResult
  if (typeof result.completedAt !== 'string' || !Number.isFinite(Date.parse(result.completedAt)) || typeof result.version !== 'string') return null
  if (!Number.isInteger(result.score) || result.score < 0 || result.score > 43 || result.total !== 43 || result.percentage !== Math.round(result.score / result.total * 1000) / 10) return null
  // Preserve the obtained grade if the provisional answer key changes later.
  try {
    const checked = gradeCoe(result.answers, result.completedAt)
    if (!result.correct || Object.keys(checked.correct).some(key => typeof result.correct[key] !== 'boolean')) return null
    return result
  } catch { return null }
}
