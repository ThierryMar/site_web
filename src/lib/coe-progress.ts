import { coeSections } from '../content/coe-exercises'
import { coeAnswerFields } from '../content/coe-answer-fields'

export type CoeAnswers = Record<string, string | number[] | Record<string, string>>
export function parseCoeNumber(value: string): number {
  const normalized = value.trim().replace('−', '-').replace(',', '.')
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized) ? Number(normalized) : NaN
}

export function coeProgress(answers: CoeAnswers) {
  let completed = 0
  let total = 0
  coeSections.forEach((section, s) => section.questions.forEach((question, q) => {
    total++
    const answer = answers[`${s}-${q}`]
    if (question.choices) {
      if (Array.isArray(answer) && answer.length > 0 &&
        (question.multiple || answer.length === 1) && new Set(answer).size === answer.length &&
        answer.every(index => Number.isInteger(index) && index >= 0 && index < question.choices!.length)) completed++
    } else if (answer && typeof answer === 'object' && !Array.isArray(answer) &&
      coeAnswerFields[`${s}-${q}`].every(field => typeof answer[field.id] === 'string' &&
        answer[field.id].length <= 100 && (field.options ? field.options.includes(answer[field.id]) : Number.isFinite(parseCoeNumber(answer[field.id]))))) completed++
  }))
  return { completed, total, complete: completed === total }
}
