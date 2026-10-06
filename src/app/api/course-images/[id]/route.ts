import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { findCourseImage } from '@/lib/course-images'
import { exampleCourseSlug } from '@/lib/course-catalog'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const image = findCourseImage(id)
  const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Cookie, Authorization' }
  if (!image) return new Response('Image not found', { status: 404, headers: privateHeaders })
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (user?.collection !== 'users' && user?.collection !== 'admins') return new Response('Sign in to view this course image', { status: 401, headers: privateHeaders })
  const course = await payload.find({ collection: 'courses', user, overrideAccess: false, draft: false, depth: 0, limit: 1,
    where: { and: [{ slug: { equals: exampleCourseSlug } }, { _status: { equals: 'published' } }] }, select: { slug: true },
  })
  if (!course.docs.length) return new Response('Course unavailable', { status: 403, headers: privateHeaders })
  const size = new URL(request.url).searchParams.get('size')
  const file = size === 'full' ? image.displayFile : size === 'still' && image.stillFile ? image.stillFile : image.previewFile
  // The request only selects a manifest ID. It never supplies a filesystem path.
  const data = await readFile(path.join(process.cwd(), 'assets/course-images/astrodynamics-laws', file))
  const extension = path.extname(file)
  const type = extension === '.gif' ? 'image/gif' : extension === '.webp' ? 'image/webp' : extension === '.png' ? 'image/png' : 'image/jpeg'
  return new Response(new Uint8Array(data), { headers: { ...privateHeaders, 'Content-Type': type, 'Content-Length': String(data.length), 'Content-Disposition': `inline; filename="${path.basename(file)}"` } })
}
