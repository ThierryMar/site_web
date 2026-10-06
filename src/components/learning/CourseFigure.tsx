'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { CourseImage } from '@/lib/course-images'
import styles from './learning.module.css'

export type FigureImage = Pick<CourseImage, 'id' | 'caption' | 'alt' | 'slides' | 'width' | 'height' | 'animated'>

export function CourseFigure({ image, compact = false }: { image: FigureImage; compact?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const full = `/api/course-images/${image.id}?size=full`
  const src = `/api/course-images/${image.id}?size=${image.animated && !playing ? 'still' : 'preview'}`
  return <figure className={`${styles.figure} ${compact ? styles.compactFigure : ''}`} data-image-id={image.id}>
    <a className={styles.figureImage} href={full} target="_blank" rel="noopener noreferrer" aria-label={`View full size: ${image.caption} (opens in a new tab)`}>
      <Image src={src} alt={image.alt} width={image.width} height={image.height} unoptimized loading="lazy" />
    </a>
    <figcaption><p>{image.caption}</p><div className={styles.figureMeta}><span>{image.slides.length ? `${image.slides.length === 1 ? 'Slide' : 'Slides'} ${image.slides.join(', ')}` : 'Presentation artwork'}</span><a href={full} target="_blank" rel="noopener noreferrer">View full size<span className="dashboard-sr-only">: {image.caption} (new tab)</span></a></div></figcaption>
    {image.animated && <button type="button" className={styles.animationButton} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? 'Pause animation' : 'Play animation'}</button>}
  </figure>
}
