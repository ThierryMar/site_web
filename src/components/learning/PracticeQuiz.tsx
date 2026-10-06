'use client'

import { useState, useTransition } from 'react'
import { checkPractice } from '@/app/(frontend)/dashboard/courses/actions'
import type { PracticeResult } from '@/lib/grade-practice'
import styles from './learning.module.css'

export function PracticeQuiz({ quiz }: { quiz: { id: number; title: string; questions: { prompt: string; choices: { text: string }[] }[] } }) {
  const [selections, setSelections] = useState<number[]>(Array(quiz.questions.length).fill(-1))
  const [result, setResult] = useState<PracticeResult | null>(null)
  const [pending, startTransition] = useTransition()
  return <section className={styles.quiz} aria-labelledby="self-check-title" id="self-check">
    <h2 id="self-check-title">{quiz.title}</h2>
    <p>Choose one answer per question, then check your responses. Your score is for practice and is not saved.</p>
    <form onSubmit={(event) => { event.preventDefault(); startTransition(async () => {
      try { setResult(await checkPractice(quiz.id, selections)) }
      catch { setResult({ error: 'Unable to check your responses. Please try again.' }) }
    }) }}>
      {quiz.questions.map((question, i) => <fieldset key={i} disabled={pending}>
        <legend>{i + 1}. {question.prompt}</legend>
        {question.choices.map((choice, j) => <label key={j}><input required type="radio" name={`question-${i}`} value={j} checked={selections[i] === j} onChange={() => { setSelections((old) => old.map((value, index) => index === i ? j : value)); setResult(null) }} /><span>{choice.text}</span></label>)}
        {result && 'answers' in result && <div className={styles.feedback} data-correct={result.answers[i].correct}><strong>{result.answers[i].correct ? 'Correct.' : `Correct answer: ${result.answers[i].correctChoice}`}</strong><p>{result.answers[i].explanation}</p></div>}
      </fieldset>)}
      <div className={styles.quizActions}><button className="dashboard-button" disabled={pending}>{pending ? 'Checking…' : 'Check my answers'}</button><button className={styles.reset} type="button" disabled={pending} onClick={() => { setSelections(Array(quiz.questions.length).fill(-1)); setResult(null) }}>Start again</button></div>
      <div role="status" className={styles.result}>{result && ('error' in result ? result.error : <><strong>{result.correct}/{result.total} correct · {result.score}%</strong><p>{result.passed ? 'You have reached the practice target. Review the explanations above.' : 'Review the explanations and revisit the lessons, then try again.'}</p></>)}</div>
    </form>
  </section>
}
