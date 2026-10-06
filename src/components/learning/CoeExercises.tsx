'use client'

import { useState } from 'react'
import { coeSections } from '@/content/coe-exercises'
import styles from './learning.module.css'

export function CoeExercises({ english }: { english: boolean }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number[]>>({})
  const [review, setReview] = useState(false)
  const count = coeSections.reduce((sum, section) => sum + section.questions.length, 0)
  const completed = Object.values(answers).filter(value => typeof value === 'string' ? value.trim().length > 0 : value.length > 0).length
  const section = coeSections[step]
  return <section className="dashboard-panel">
    <p role="note"><strong>{english ? 'Using the Orbit101 application is recommended to complete this quiz.' : 'L’utilisation de l’application Orbit101 est recommandée pour réaliser ce quiz.'}</strong></p>
    <p>{english ? 'Answer the exercises from the original document. Answers remain available while this page is open. There is no automatic grading.' : 'Répondez aux exercices du document original. Vos réponses restent disponibles tant que cette page est ouverte. Aucune correction automatique n’est appliquée.'}</p>
    <p aria-live="polite">{completed} / {count} {english ? 'questions answered' : 'questions répondues'}</p>
    <progress value={completed} max={count} aria-label={english ? 'Questions answered' : 'Questions répondues'} />
    {review ? <>
      <h2>{english ? 'Your answers' : 'Vos réponses'}</h2>
      {coeSections.map((group, s) => <section key={s} lang="en"><h3>{group.title}</h3>{group.context && <p>{group.context}</p>}<ol>{group.questions.map((question, q) => {
        const answer = answers[`${s}-${q}`]
        return <li key={q}><p>{question.prompt}</p><p>{typeof answer === 'string' && answer.trim() ? answer : Array.isArray(answer) && answer.length ? answer.map(i => question.choices?.[i]).join('; ') : english ? 'Not answered' : 'Sans réponse'}</p></li>
      })}</ol></section>)}
      <button className="dashboard-button" onClick={() => setReview(false)}>{english ? 'Continue editing' : 'Continuer à répondre'}</button>
    </> : <>
      <p>{english ? 'Section' : 'Section'} {step + 1} / {coeSections.length}</p>
      <div className={styles.quiz} lang="en" key={step}>
        <h2 tabIndex={-1}>{section.title}</h2>
        {section.context && <p>{section.context}</p>}
        {section.questions.map((question, q) => {
          const key = `${step}-${q}`
          const answer = answers[key]
          return <fieldset key={key}><legend>{q + 1}. {question.prompt}</legend>
            {question.choices ? question.choices.map((choice, i) => <label key={i}><input type={question.multiple ? 'checkbox' : 'radio'} name={key} checked={Array.isArray(answer) && answer.includes(i)} onChange={() => setAnswers(previous => {
              const selected = Array.isArray(previous[key]) ? previous[key] as number[] : []
              return { ...previous, [key]: question.multiple ? selected.includes(i) ? selected.filter(value => value !== i) : [...selected, i] : [i] }
            })} />{choice}</label>) : <textarea aria-label={question.prompt} rows={4} value={typeof answer === 'string' ? answer : ''} onChange={event => setAnswers(previous => ({ ...previous, [key]: event.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: 12, font: 'inherit' }} />}
          </fieldset>
        })}
      </div>
      <div className={styles.quizActions}>
        <button className="dashboard-button" disabled={step === 0} onClick={() => setStep(step - 1)}>{english ? 'Previous' : 'Précédent'}</button>
        {step < coeSections.length - 1 && <button className="dashboard-button" onClick={() => setStep(step + 1)}>{english ? 'Next' : 'Suivant'}</button>}
        <button className="dashboard-button" onClick={() => setReview(true)}>{english ? 'Review my answers' : 'Relire mes réponses'}</button>
      </div>
    </>}
    <p><small>© SpaceOrbitLAB, 2026 · SꙨL Part II – COE exercises</small></p>
  </section>
}
