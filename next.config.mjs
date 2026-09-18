import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/index.html/Download.html', destination: '/downloads', permanent: true },
      { source: '/Download.html', destination: '/downloads', permanent: true },
      ...['Fichiers', 'Telechargement'].flatMap((directory) => [
        { source: `/index.html/${directory}/:path*`, destination: `/legacy/${directory}/:path*`, permanent: true },
        { source: `/${directory}/:path*`, destination: `/legacy/${directory}/:path*`, permanent: true },
      ]),
    ]
  },
})
