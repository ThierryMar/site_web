import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  poweredByHeader: false,
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
