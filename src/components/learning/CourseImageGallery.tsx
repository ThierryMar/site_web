'use client'

import { useState } from 'react'
import type { CourseImage } from '@/lib/course-images'
import { CourseFigure } from './CourseFigure'
import styles from './learning.module.css'

export function CourseImageGallery({ images, lessons }: { images: CourseImage[]; lessons: { slug: string; title: string }[] }) {
  const [filter, setFilter] = useState('all')
  const visible = images.filter((image) => filter === 'all' || image.lesson === filter)
  return <section>
    <h2 className={styles.lessonTitle}>Course illustrations</h2>
    <p className={styles.imageNote}>{images.length} selected diagrams and animations to help explain the course concepts. Each illustration also appears in its lesson and opens in full size.</p>
    <div className={styles.galleryFilter}><label htmlFor="image-lesson-filter">Show illustrations from</label><select id="image-lesson-filter" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All lessons</option>{lessons.filter((lesson) => images.some((image) => image.lesson === lesson.slug)).map((lesson) => <option key={lesson.slug} value={lesson.slug}>{lesson.title}</option>)}</select><span role="status">{visible.length} illustrations</span></div>
    <div className={styles.figureGrid}>{visible.map((image) => <CourseFigure key={image.id} image={image} compact />)}</div>
  </section>
}
