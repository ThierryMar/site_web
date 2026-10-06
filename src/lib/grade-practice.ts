import type { Quiz } from '../payload-types'

export type PracticeResult = { error: string } | {
  score: number; correct: number; total: number; passed: boolean;
  answers: { correct: boolean; correctChoice: string; explanation: string }[];
}

function plainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const value = node as { text?: string; children?: unknown[]; root?: unknown }
  if (value.root) return plainText(value.root)
  if (typeof value.text === 'string') return value.text
  return value.children?.map(plainText).join(' ') ?? ''
}

export function gradePractice(quiz: Quiz, selections: unknown): PracticeResult {
  if (!Array.isArray(selections) || selections.length !== quiz.questions.length ||
    selections.some((choice, i) => !Number.isInteger(choice) || choice < 0 || choice >= quiz.questions[i].choices.length)) {
    return { error: 'Please answer every question before checking your responses.' }
  }
  if (quiz.questions.some((q) => q.choices.filter((c) => c.isCorrect).length !== 1)) return { error: 'This self-check is temporarily unavailable.' }
  const answers = quiz.questions.map((question, i) => ({
    correct: question.choices[selections[i]].isCorrect === true,
    correctChoice: question.choices.find((c) => c.isCorrect)!.text,
    explanation: plainText(question.explanation),
  }))
  const correct = answers.filter((a) => a.correct).length
  const score = Math.round(correct / answers.length * 100)
  return { score, correct, total: answers.length, passed: score >= quiz.passingScore, answers }
}
