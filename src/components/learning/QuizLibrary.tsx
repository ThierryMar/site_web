import Link from 'next/link'
import type { Payload } from 'payload'
import type { User } from '@/payload-types'
import { readCourse } from '@/lib/read-learning'
import { lessonPath } from '@/lib/course-catalog'
import { readCoeResult } from '@/lib/grade-coe'
import styles from './learning.module.css'

const courses = [
  { slug: 'course-1', title: 'Basic Astronomy and Celestial Mechanics' },
  { slug: 'course-2', title: 'Foundations of Astrodynamics' },
  { slug: 'course-3', title: 'Advanced Astrodynamics and Space Situational Awareness' },
  { slug: 'course-4', title: 'Remote Sensing from Space' },
]

export async function QuizLibrary({ payload, user, english }: {
  payload: Payload; user: User & { collection: 'users' }; english: boolean
}) {
  const contents = await Promise.allSettled(courses.map(course => readCourse(payload, user, course.slug)))
  const lastResult = readCoeResult(user.lastCoeResult)
  return <div className={styles.library}>{courses.map((course, index) => {
    const response = contents[index]
    const data = response.status === 'fulfilled' ? response.value : null
    const quizzes = data?.quizzes ?? []
    const coe = course.slug === 'course-2'
    return <section className="dashboard-panel" id={`quiz-${course.slug}`} aria-labelledby={`quiz-${course.slug}-title`} key={course.slug}>
      <h2 id={`quiz-${course.slug}-title`}>{english ? 'Course' : 'Cours'} {index + 1} — <span lang="en">{course.title}</span></h2>
      {response.status === 'rejected' && <p role="status">{english ? 'Course quizzes are temporarily unavailable. Please try again later.' : 'Les quiz du cours sont temporairement indisponibles. Réessayez dans quelques instants.'}</p>}
      {quizzes.length > 0 && <ul className={styles.lessonList}>{quizzes.map(quiz => <li key={quiz.id}><Link href={`${lessonPath(course.slug, 'astrodynamics-practice')}#self-check`}><span lang="en">{quiz.title}</span><span>{english ? 'Practice' : 'Entraînement'}</span></Link></li>)}</ul>}
      {quizzes.length > 0 && <p>{english ? 'Practice quizzes above provide immediate feedback; their results are not saved.' : 'Les quiz d’entraînement ci-dessus donnent un corrigé immédiat ; leurs résultats ne sont pas enregistrés.'}</p>}
      {coe && <article className={styles.quizEntry} aria-labelledby="coe-quiz-title">
        <h3 id="coe-quiz-title">SOL Part II - COE exercices</h3>
        {lastResult && <p className="dashboard-quiz-score"><strong>{english ? 'Last result' : 'Dernier résultat'} : {lastResult.score} / {lastResult.total} — {lastResult.percentage} %</strong> · {english ? 'Provisional grade' : 'Note provisoire'}</p>}
        <p>{english ? 'Using the Orbit101 application is recommended to complete this quiz.' : 'L’utilisation de l’application Orbit101 est recommandée pour réaliser ce quiz.'}</p>
        <p>{english ? '14 sections: orbital elements, orbit visualization and calculation exercises. Your latest result is saved to your account.' : '14 sections : éléments orbitaux, visualisation des orbites et exercices de calcul. Votre dernier résultat est enregistré dans votre compte.'}</p>
        <Link className="dashboard-button" href="/dashboard/quizzes/sol-part-ii-coe-exercices">{english ? 'Open the quiz' : 'Ouvrir le quiz'}</Link>
      </article>}
      {!coe && quizzes.length === 0 && response.status === 'fulfilled' && <p>{english ? 'No quizzes available for this course yet.' : 'Aucun quiz disponible pour ce cours pour le moment.'}</p>}
    </section>
  })}</div>
}
