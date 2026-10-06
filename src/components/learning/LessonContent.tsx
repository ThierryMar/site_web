import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Lesson } from '@/payload-types'
import { imagesForLesson } from '@/lib/course-images'
import { CourseFigure } from './CourseFigure'
import styles from './learning.module.css'

function textOf(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const value = node as { text?: string; children?: unknown[] }
  return typeof value.text === 'string' ? value.text : value.children?.map(textOf).join('') ?? ''
}

export function LessonContent({ lesson }: { lesson: Lesson }) {
  const images = imagesForLesson(lesson.slug)
  const sections: { heading: string; children: Lesson['content']['root']['children'] }[] = []
  for (const node of lesson.content.root.children) {
    if (node.type === 'heading' || sections.length === 0) sections.push({ heading: node.type === 'heading' ? textOf(node) : '', children: [] })
    sections[sections.length - 1].children.push(node)
  }
  const remaining = images.filter((image) => !image.heading || !sections.some((section) => section.heading === image.heading))
  return <>
    {sections.map((section, i) => {
      const figures = images.filter((image) => image.heading && image.heading === section.heading)
      return <section className={styles.lessonSection} key={i}>
        <div className={styles.prose}><RichText data={{ ...lesson.content, root: { ...lesson.content.root, children: section.children } }} /></div>
        {figures.length > 0 && <div className={figures.length > 3 ? styles.figureGrid : styles.figureStack}>{figures.map((image) => <CourseFigure image={image} key={image.id} compact={figures.length > 3} />)}</div>}
      </section>
    })}
    {remaining.length > 0 && <div className={styles.figureStack}>{remaining.map((image) => <CourseFigure image={image} key={image.id} />)}</div>}
  </>
}
