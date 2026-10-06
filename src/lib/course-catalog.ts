// This first published example is available to every signed-in participant.
// Other courses keep their existing admin-only access until enrollment is implemented.
export const exampleCourseSlug = 'course-2'
export const exampleCoursePath = `/dashboard/courses/${exampleCourseSlug}`

export function lessonPath(courseSlug: string, lessonSlug: string) {
  return `/dashboard/courses/${encodeURIComponent(courseSlug)}?lesson=${encodeURIComponent(lessonSlug)}`
}
