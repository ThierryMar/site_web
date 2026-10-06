'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { coeSections } from '@/content/coe-exercises'
import { coeCorrections, coeCorrectionConstants } from '@/content/coe-corrections'
import { coeProgress, type CoeAnswers } from '@/lib/coe-progress'
import { coeAnswerFields } from '@/content/coe-answer-fields'
import type { CoeResult } from '@/lib/grade-coe'
import { submitCoe } from '@/app/(frontend)/dashboard/quizzes/sol-part-ii-coe-exercices/actions'
import styles from './learning.module.css'

export function CoeExercises({ english, lastResult }: { english: boolean; lastResult: CoeResult | null }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CoeAnswers>({})
  const [review, setReview] = useState(false)
  const [result, setResult] = useState(lastResult)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  function finish() {
    setError('')
    startTransition(async () => {
      try {
        const response = await submitCoe(answers)
        if (!response.result) { setError(english ? 'Unable to save the result. Check your connection and sign-in, then try again.' : 'Impossible d’enregistrer le résultat. Vérifiez votre connexion et votre session, puis réessayez.'); return }
        setResult(response.result)
        setAnswers(response.result.answers)
        setReview(true)
      } catch { setError(english ? 'Unable to save. Please try again.' : 'Enregistrement impossible. Réessayez.') }
    })
  }
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (review) {
      reviewHeading.current?.focus()
      reviewHeading.current?.scrollIntoView({ block: 'start' })
    }
  }, [review])
  const { completed, total: count, complete } = coeProgress(answers)
  const showCorrections = review && complete
  const section = coeSections[step]
  return <section className="dashboard-panel">
    <p role="note"><strong>{english ? 'Using the Orbit101 application is recommended to complete this quiz.' : 'L’utilisation de l’application Orbit101 est recommandée pour réaliser ce quiz.'}</strong></p>
    <p>{english ? 'Each question is worth one point; all its components must be correct. Numeric tolerance: 1% (0.1° for angles). The intended circular interpretation is accepted for the rounded state vector. Your latest submitted result is saved to your account.' : 'Chaque question vaut un point ; toutes ses sous-réponses doivent être correctes. Tolérance numérique : 1 % (0,1° pour les angles). L’interprétation circulaire prévue est acceptée pour le vecteur arrondi. Votre dernier résultat soumis est enregistré dans votre compte.'}</p>
    {result && <section aria-label={english ? 'Last saved result' : 'Dernier résultat enregistré'}>
      <h2 className="dashboard-quiz-score">{english ? 'Last saved result' : 'Dernier résultat enregistré'} : {result.score} / {result.total} — {result.percentage} %</h2>
      <p>{new Intl.DateTimeFormat(english ? 'en-CA' : 'fr-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' }).format(new Date(result.completedAt))} · {english ? 'Provisional grade — pending validation' : 'Note provisoire — à valider'}</p>
      <button className="dashboard-button" disabled={pending} onClick={() => { setAnswers(result.answers); setReview(true); setError('') }}>{english ? 'View my last result' : 'Voir mon dernier résultat'}</button>
      <button className="dashboard-button" disabled={pending} onClick={() => { setAnswers({}); setReview(false); setStep(0); setError('') }}>{english ? 'Retake the quiz' : 'Recommencer le quiz'}</button>
    </section>}
    {error && <p role="alert">{error}</p>}
    <p aria-live="polite">{completed} / {count} {english ? 'questions answered' : 'questions répondues'}</p>
    <progress value={completed} max={count} aria-label={english ? 'Questions answered' : 'Questions répondues'} />
    {review ? <>
      <h2 ref={reviewHeading} tabIndex={-1}>{showCorrections ? english ? 'Provisional answer key — pending validation' : 'Corrigé provisoire — à valider' : english ? 'Your answers' : 'Vos réponses'}</h2>
      {showCorrections && result && answers === result.answers && <p className="dashboard-quiz-score" role="status"><strong>{english ? 'Final grade' : 'Note finale'} : {result.score} / {result.total} — {result.percentage} % · {english ? 'Saved to your account' : 'Enregistrée dans votre compte'}</strong></p>}
      {showCorrections && <div role="note">
        <p><strong>{english ? 'This answer key and grade are provisional and must be validated against the official solution.' : 'Ce corrigé et la note sont provisoires et doivent être validés avec la solution officielle.'}</strong></p>
        <p lang="en">{coeCorrectionConstants}</p>
      </div>}
      {coeSections.map((group, s) => <section key={s} lang="en"><h3>{group.title}</h3>{group.context && <p>{group.context}</p>}<ol>{group.questions.map((question, q) => {
        const answer = answers[`${s}-${q}`]
        const correction = coeCorrections[s][q]
        const matches = Array.isArray(answer) && correction.choices && answer.length === correction.choices.length && correction.choices.every(i => answer.includes(i))
        const structured = answer && typeof answer === 'object' && !Array.isArray(answer) ? coeAnswerFields[`${s}-${q}`]?.map(field => `${field.label}: ${answer[field.id] || '—'}${field.unit ? ` ${field.unit}` : ''}`).join('; ') : null
        return <li key={q}><p>{question.prompt}</p><p><strong>{english ? 'Your answer: ' : 'Votre réponse : '}</strong>{structured || (Array.isArray(answer) && answer.length ? answer.map(i => question.choices?.[i]).join('; ') : english ? 'Not answered' : 'Sans réponse')}</p>
          {showCorrections && <div>
            {result && answers === result.answers && <p><strong>{result.correct[`${s}-${q}`] ? english ? 'Correct — 1/1' : 'Correct — 1/1' : english ? 'Incorrect — 0/1' : 'Incorrect — 0/1'}</strong></p>}
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
          return <fieldset key={key} disabled={pending}><legend>{q + 1}. {question.prompt}</legend>
            {question.choices ? question.choices.map((choice, i) => <label key={i}><input type={question.multiple ? 'checkbox' : 'radio'} name={key} checked={Array.isArray(answer) && answer.includes(i)} onChange={() => setAnswers(previous => {
              const selected = Array.isArray(previous[key]) ? previous[key] as number[] : []
              return { ...previous, [key]: question.multiple ? selected.includes(i) ? selected.filter(value => value !== i) : [...selected, i] : [i] }
            })} />{choice}</label>) : coeAnswerFields[key].map(field => {
              const value = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer[field.id] || '' : ''
              const update = (value: string) => setAnswers(previous => ({ ...previous, [key]: { ...(previous[key] && typeof previous[key] === 'object' && !Array.isArray(previous[key]) ? previous[key] as Record<string, string> : {}), [field.id]: value } }))
              return <label key={field.id} style={{ display: 'grid' }}>{field.label}{field.unit ? ` (${field.unit})` : ''}
                {field.options ? <select aria-label={`${key} ${field.label}`} value={value} onChange={event => update(event.target.value)}><option value="">{english ? 'Select an answer' : 'Choisir une réponse'}</option>{field.options.map(option => <option key={option}>{option}</option>)}</select> : <input type="text" inputMode="decimal" aria-label={`${key} ${field.label}`} value={value} maxLength={100} onChange={event => update(event.target.value)} />}
              </label>
            })}
          </fieldset>
        })}
      </div>
      <div className={styles.quizActions}>
        <button className="dashboard-button" disabled={step === 0} onClick={() => setStep(step - 1)}>{english ? 'Previous' : 'Précédent'}</button>
        {step < coeSections.length - 1 && <button className="dashboard-button" onClick={() => setStep(step + 1)}>{english ? 'Next' : 'Suivant'}</button>}
        {!complete && <button className="dashboard-button" disabled={pending} onClick={() => setReview(true)}>{english ? 'Review my answers' : 'Relire mes réponses'}</button>}
        <button className="dashboard-button" disabled={!complete || pending} onClick={finish}>{pending ? english ? 'Saving…' : 'Enregistrement…' : english ? 'Finish and view my grade' : 'Terminer et voir ma note'}</button>
      </div>
      {!complete && <p role="status">{english ? `Answer the remaining ${count - completed} questions to unlock the answer key.` : `Répondez aux ${count - completed} questions restantes pour débloquer le corrigé.`}</p>}
    </>}
    <p><small>© SpaceOrbitLAB, 2026 · SꙨL Part II – COE exercises</small></p>
  </section>
}
