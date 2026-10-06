import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'
import { DashboardShell } from '@/components/DashboardShell'
import { OrbitCalculator } from '@/components/learning/OrbitCalculator'
import { PracticeQuiz } from '@/components/learning/PracticeQuiz'
import { CourseContents } from '@/components/learning/CourseContents'
import { LessonContent } from '@/components/learning/LessonContent'
import { CourseImageGallery } from '@/components/learning/CourseImageGallery'
import { courseImages } from '@/lib/course-images'
import { readCourse } from '@/lib/read-learning'
import { getAccountLanguage } from '@/lib/account-language'
import { lessonPath } from '@/lib/course-catalog'
import styles from '@/components/learning/learning.module.css'
import '../../dashboard.css'

export const metadata: Metadata = { title: 'Astrodynamics Laws · My courses', robots: { index: false, follow: false } }

export default async function CoursePage({ params, searchParams }: {
  params: Promise<{ slug: string }>; searchParams: Promise<{ lesson?: string | string[]; images?: string | string[] }>
}) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.collection !== 'users') redirect('/connexion')
  const { slug } = await params
  const { t } = await getAccountLanguage()
  let data
  try { data = await readCourse(payload, user, slug) }
  catch { return <DashboardShell section="courses" name={user.name ?? ''} email={user.email}><section className="dashboard-panel" role="status"><h1>{t('Cours temporairement indisponibles')}</h1><p>{t('Réessayez dans quelques instants.')}</p><Link className="dashboard-text-link" href={`/dashboard/courses/${encodeURIComponent(slug)}`}>{t('Réessayer')}</Link></section></DashboardShell> }
  if (!data) notFound()
  const query = await searchParams
  const requested = query.lesson
  const showImages = query.images === 'all'
  if (query.images !== undefined && (!showImages || requested !== undefined)) notFound()
  const lesson = typeof requested === 'string' ? data.lessons.find((item) => item.slug === requested) : null
  if (requested !== undefined && !lesson) notFound()
  const index = lesson ? data.lessons.findIndex((item) => item.id === lesson.id) : -1
  const previous = index > 0 ? data.lessons[index - 1] : null
  const next = data.lessons[index + 1]
  const coursePath = `/dashboard/courses/${encodeURIComponent(data.course.slug)}`
  return <DashboardShell section="courses" name={user.name ?? ''} email={user.email}>
    <Link className={styles.back} href="/dashboard?section=courses">← {t('Mes cours')}</Link>
    <div lang="en" className={styles.reader}>
      <header className={styles.courseHeader}><p>Course II / Section 1</p><h1>{data.course.title}</h1><span>Astrodynamics Laws</span></header>
      <div className={styles.readerGrid}>
        <CourseContents slug={data.course.slug} selected={lesson?.id} gallery={showImages} lessons={data.lessons.map(({ id, slug, title, durationMinutes }) => ({ id, slug, title, durationMinutes }))} />
        <article className={styles.lesson} id="lesson-content">
          {showImages ? <CourseImageGallery images={courseImages} lessons={data.lessons.map(({ slug, title }) => ({ slug, title }))} /> : lesson ? <>
            <p className={styles.lessonMeta}>Lesson {index + 1} of {data.lessons.length} · {lesson.durationMinutes} min</p>
            <h2 className={styles.lessonTitle}>{lesson.title}</h2>
            <LessonContent lesson={lesson} />
            {['astrodynamics-kepler-laws', 'astrodynamics-specific-energy', 'astrodynamics-angular-momentum'].includes(lesson.slug) && <OrbitCalculator />}
            {lesson.slug === 'astrodynamics-practice' && data.quizzes.map((quiz) => <PracticeQuiz key={quiz.id} quiz={{ id: quiz.id, title: quiz.title, questions: quiz.questions.map((question) => ({ prompt: question.prompt, choices: question.choices.map(({ text }) => ({ text })) })) }} />)}
          </> : <>
            <p className={styles.lessonMeta}>Richard L. Lachance, Ph.D. / SpaceOrbitLAB</p><h2 className={styles.lessonTitle}>The laws behind every orbit</h2>
            <div className={styles.prose}>{data.course.description && <RichText data={data.course.description} />}<h3>Learning objectives</h3><ul>{data.course.objectives?.map((item) => <li key={item.id ?? item.objective}>{item.objective}</li>)}</ul></div>
            <OrbitCalculator />
            <div className={styles.start}><p>Begin with the mission context, or choose a lesson from the contents.</p>{next && <Link className="dashboard-button" href={lessonPath(slug, next.slug)}>Start the first lesson</Link>}</div>
          </>}
          {lesson && <nav className={styles.lessonPagination} aria-label="Lesson navigation"><Link href={previous ? lessonPath(slug, previous.slug) : coursePath}><small>Previous</small><span>{previous?.title ?? 'Module overview'}</span></Link>{next ? <Link href={lessonPath(slug, next.slug)}><small>Next lesson</small><span>{next.title} →</span></Link> : <Link href="/dashboard?section=courses"><small>End of module</small><span>Back to my courses →</span></Link>}</nav>}
        </article>
      </div>
    </div>
  </DashboardShell>
}
