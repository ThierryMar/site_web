'use client'

import { useState } from 'react'
import { coeSections } from '@/content/coe-exercises'
import { coeCorrections, coeCorrectionConstants } from '@/content/coe-corrections'
import { coeProgress, type CoeAnswers } from '@/lib/coe-progress'
import styles from './learning.module.css'

export function CoeExercises({ english }: { english: boolean }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CoeAnswers>({})
  const [review, setReview] = useState(false)
  const { completed, total: count, complete } = coeProgress(answers)
  const showCorrections = review && complete
  const section = coeSections[step]
  return <section className="dashboard-panel">
    <p role="note"><strong>{english ? 'Using the Orbit101 application is recommended to complete this quiz.' : 'L’utilisation de l’application Orbit101 est recommandée pour réaliser ce quiz.'}</strong></p>
    <p>{english ? 'Answer every question, then finish the quiz to view the provisional answer key. Answers remain available while this page is open.' : 'Répondez à toutes les questions, puis terminez le quiz pour consulter le corrigé provisoire. Vos réponses restent disponibles tant que cette page est ouverte.'}</p>
    <p aria-live="polite">{completed} / {count} {english ? 'questions answered' : 'questions répondues'}</p>
    <progress value={completed} max={count} aria-label={english ? 'Questions answered' : 'Questions répondues'} />
    {review ? <>
      <h2>{showCorrections ? english ? 'Provisional answer key — pending validation' : 'Corrigé provisoire — à valider' : english ? 'Your answers' : 'Vos réponses'}</h2>
      {showCorrections && <div role="note">
        <p><strong>{english ? 'This answer key was prepared without an official solution. It is provisional and must be validated. Written calculations are compared with a model answer, without automatic grading.' : 'Ce corrigé a été préparé sans solution officielle. Il est provisoire et doit être validé. Les calculs rédigés sont accompagnés d’une réponse modèle, sans notation automatique.'}</strong></p>
        <p lang="en">{coeCorrectionConstants}</p>
      </div>}
      {coeSections.map((group, s) => <section key={s} lang="en"><h3>{group.title}</h3>{group.context && <p>{group.context}</p>}<ol>{group.questions.map((question, q) => {
        const answer = answers[`${s}-${q}`]
        const correction = coeCorrections[s][q]
        const matches = Array.isArray(answer) && correction.choices && answer.length === correction.choices.length && correction.choices.every(i => answer.includes(i))
        return <li key={q}><p>{question.prompt}</p><p><strong>{english ? 'Your answer: ' : 'Votre réponse : '}</strong>{typeof answer === 'string' && answer.trim() ? answer : Array.isArray(answer) && answer.length ? answer.map(i => question.choices?.[i]).join('; ') : english ? 'Not answered' : 'Sans réponse'}</p>
          {showCorrections && <div>
            <p><strong>{correction.choices ? matches ? english ? 'Matches the provisional key' : 'Conforme au corrigé provisoire' : english ? 'Review your selection' : 'Sélection à revoir' : english ? 'Compare your calculation with the model below' : 'Comparez votre calcul avec le modèle ci-dessous'}</strong></p>
            <p><strong>{english ? 'Expected answer: ' : 'Réponse attendue : '}</strong>{correction.answer}</p>
            <p>{correction.explanation}</p>
          </div>}
        </li>
      })}</ol></section>)}
      <button className="dashboard-button" onClick={() => setReview(false)}>{english ? 'Continue editing' : 'Continuer à répondre'}</button>
      {showCorrections && <p>{english ? 'Reference for orbital-element conventions: ' : 'Référence pour les conventions des éléments orbitaux : '}<a className="dashboard-text-link" href="https://oer.pressbooks.pub/lynnanegeorge/chapter/copy-of-chapter-3__editing/" target="_blank" rel="noreferrer">Lynnane George — The Classical Orbital Elements</a></p>}
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
        <button className="dashboard-button" disabled={!complete} onClick={() => setReview(true)}>{english ? 'Finish and view the answer key' : 'Terminer et voir le corrigé'}</button>
      </div>
      {!complete && <p role="status">{english ? `Answer the remaining ${count - completed} questions to unlock the answer key.` : `Répondez aux ${count - completed} questions restantes pour débloquer le corrigé.`}</p>}
    </>}
    <p><small>© SpaceOrbitLAB, 2026 · SꙨL Part II – COE exercises</small></p>
  </section>
}
