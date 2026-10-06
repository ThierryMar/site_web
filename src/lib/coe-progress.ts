import { coeSections } from '../content/coe-exercises'

export type CoeAnswers = Record<string, string | number[]>

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
    } else if (typeof answer === 'string' && answer.trim()) completed++
  }))
  return { completed, total, complete: completed === total }
}
