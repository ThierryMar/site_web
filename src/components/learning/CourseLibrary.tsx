import Link from 'next/link'
import type { Payload } from 'payload'
import type { User } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { readCourse, readCourses } from '@/lib/read-learning'
import { lessonPath } from '@/lib/course-catalog'
import styles from './learning.module.css'

export async function CourseLibrary({ payload, user, view, t }: {
  payload: Payload; user: User & { collection: 'users' }; view: 'courses' | 'lessons' | 'quizzes'; t: (text: string) => string
}) {
  let courses
  try { courses = await readCourses(payload, user) }
  catch { return <section className="dashboard-panel" role="status"><h2>{t('Cours temporairement indisponibles')}</h2><p>{t('Réessayez dans quelques instants.')}</p><Link className="dashboard-text-link" href={`/dashboard?section=${view}`}>{t('Réessayer')}</Link></section> }
  if (!courses.length) return <section className="dashboard-panel"><h2>{t('Les cours arrivent bientôt')}</h2><p>{t('Les modules publiés apparaîtront ici.')}</p></section>
  if (view === 'courses') return <div className={styles.library}>{courses.map((course) => <article className={styles.courseCard} key={course.id}>
    <div className={styles.courseMark} aria-hidden="true"><svg viewBox="0 0 280 220" fill="none"><ellipse cx="140" cy="110" rx="111" ry="72" stroke="currentColor" /><circle cx="64" cy="110" r="9" fill="#D4A017" /><path d="M64 110 191 48M64 110 222 161" stroke="currentColor" strokeDasharray="4 5" /><circle cx="191" cy="48" r="5" fill="#fffdf8" /><circle cx="222" cy="161" r="5" fill="#fffdf8" /></svg><span>Kepler & Newton</span></div>
    <div><p className={styles.available}>{t('Cours disponible')}</p><h2 lang="en">{course.title}</h2><div lang="en" className={styles.cardDescription}>{course.description && <RichText data={course.description} />}</div><Link className="dashboard-button" href={`/dashboard/courses/${encodeURIComponent(course.slug)}`}>{t('Ouvrir le cours')}</Link></div>
  </article>)}</div>
  let contents
  try { contents = await Promise.all(courses.map((course) => readCourse(payload, user, course.slug))) }
  catch { return <section className="dashboard-panel" role="status"><h2>{t('Cours temporairement indisponibles')}</h2><p>{t('Réessayez dans quelques instants.')}</p></section> }
  return <div className={styles.library}>{contents.map((data) => data && <section className="dashboard-panel" key={data.course.id}>
      <h2 lang="en">{data.course.title}</h2>
      <ol className={styles.lessonList}>{view === 'lessons' ? data.lessons.map((lesson) => <li key={lesson.id}><Link href={lessonPath(data.course.slug, lesson.slug)}><span lang="en">{lesson.title}</span><span>{lesson.durationMinutes} min</span></Link></li>) : data.quizzes.map((quiz) => <li key={quiz.id}><Link href={`${lessonPath(data.course.slug, 'astrodynamics-practice')}#self-check`}><span lang="en">{quiz.title}</span><span>{t('Entraînement')}</span></Link></li>)}</ol>
      {view === 'quizzes' && <p>{t('Les quiz d’entraînement donnent un corrigé immédiat. Les résultats ne sont pas enregistrés.')}</p>}
    </section>)}</div>
}
