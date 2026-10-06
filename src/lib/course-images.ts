import manifest from '../content/astrodynamics-images.json'

export type CourseImage = typeof manifest.images[number]
export const courseImages = manifest.images
export const courseImageCount = manifest.total
export const courseImageSource = manifest.source

export function findCourseImage(id: string) {
  return courseImages.find((image) => image.id === id)
}

export function imagesForLesson(slug: string) {
  return courseImages.filter((image) => image.lesson === slug)
}

export function courseImageUrl(id: string, size: 'preview' | 'full' | 'still' = 'preview') {
  return `/api/course-images/${encodeURIComponent(id)}?size=${size}`
}
