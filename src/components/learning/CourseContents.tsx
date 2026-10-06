'use client'

import Link from 'next/link'
import { useState } from 'react'
import { lessonPath } from '@/lib/course-catalog'
import styles from './learning.module.css'

export function CourseContents({ slug, selected, lessons, gallery = false }: {
  slug: string; selected?: number; gallery?: boolean; lessons: { id: number; slug: string; title: string; durationMinutes?: number | null }[]
}) {
  const [expanded, setExpanded] = useState(false)
  return <nav className={styles.contents} aria-label="Course lessons">
    <Link className={styles.overviewLink} href={`/dashboard/courses/${encodeURIComponent(slug)}`} aria-current={selected === undefined && !gallery ? 'page' : undefined}>Module overview</Link>
    <p>{lessons.length} lessons · {lessons.reduce((sum, item) => sum + (item.durationMinutes ?? 0), 0)} min estimated</p>
    <button className={styles.contentsToggle} type="button" aria-expanded={expanded} aria-controls="course-lesson-links" onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide lesson contents' : 'Choose a lesson'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <div id="course-lesson-links" className={styles.contentsBody} data-expanded={expanded}>
      <ol>{lessons.map((item, i) => <li key={item.id}><Link href={`${lessonPath(slug, item.slug)}#lesson-content`} aria-current={selected === item.id ? 'page' : undefined} onClick={() => setExpanded(false)}><span className={styles.lessonNumber}>{String(i + 1).padStart(2, '0')}</span><span>{item.title}<small>{item.durationMinutes} min</small></span></Link></li>)}</ol>
      <Link className={styles.publicLink} href="/courses#course-2">View the abridged version</Link>
    </div>
    <Link className={styles.overviewLink} href={`/dashboard/courses/${encodeURIComponent(slug)}?images=all`} aria-current={gallery ? 'page' : undefined}>Course illustrations</Link>
  </nav>
}
