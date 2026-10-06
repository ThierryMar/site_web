import { withPayload } from '@payloadcms/next/withPayload'
import { readFileSync, readdirSync, statSync } from 'node:fs'

const courseImageManifest = JSON.parse(readFileSync(new URL('./src/content/astrodynamics-images.json', import.meta.url), 'utf8'))
const courseImageFiles = [...new Set(courseImageManifest.images.flatMap((image) => [image.previewFile, image.displayFile, image.stillFile].filter(Boolean)))]
const courseImageRoot = new URL('./assets/course-images/astrodynamics-laws/', import.meta.url)
const archivedImageFiles = readdirSync(courseImageRoot, { recursive: true })
  .map((file) => file.replaceAll('\\', '/'))
  .filter((file) => !courseImageFiles.includes(file) && statSync(new URL(file, courseImageRoot)).isFile())

export default withPayload({
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/course-images/*': courseImageFiles.map((file) => `./assets/course-images/astrodynamics-laws/${file}`),
  },
  outputFileTracingExcludes: {
    '/api/course-images/*': archivedImageFiles.map((file) => `./assets/course-images/astrodynamics-laws/${file}`),
  },
  async rewrites() {
    return [
      { source: '/simulations', destination: '/legacy/Simulations.html' },
      { source: '/SOL.py', destination: '/legacy/SOL.py' },
      { source: '/SOL_Tools/:path*', destination: '/legacy/SOL_Tools/:path*' },
    ]
  },
  async redirects() {
    return [
      ...[['Contact%20Us.html', '/contact'], ['Simulations.html', '/simulations'], ['Objectives.html', '/objectives']].flatMap(([source, destination]) => [
        { source: `/${source}`, destination, permanent: true },
        { source: `/index.html/${source}`, destination, permanent: true },
      ]),
      ...['introduction', 'courses'].flatMap((page) => [
        { source: `/index.html/${page}.html`, destination: `/${page}`, permanent: true },
        { source: `/${page}.html`, destination: `/${page}`, permanent: true },
      ]),
      { source: '/index.html/Download.html', destination: '/downloads', permanent: true },
      { source: '/Download.html', destination: '/downloads', permanent: true },
      ...['Fichiers', 'Telechargement'].flatMap((directory) => [
        { source: `/index.html/${directory}/:path*`, destination: `/legacy/${directory}/:path*`, permanent: true },
        { source: `/${directory}/:path*`, destination: `/legacy/${directory}/:path*`, permanent: true },
      ]),
    ]
  },
})
