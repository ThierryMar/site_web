import type { Metadata } from 'next'
import { connection } from 'next/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { loadDownloads } from '@/lib/load-downloads'
import { isDownloadUrl } from '@/lib/download-url'
import type { Download } from '@/payload-types'
import styles from './downloads.module.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: 'Downloads', description: 'Download SpaceOrbitLAB course notes, assignments, astrodynamics references, and the Orbits101 simulator.',
  alternates: { canonical: '/downloads' },
}

function Resource({ resource }: { resource: Download }) {
  return <div className="encadre-information">
    <strong>{resource.title}</strong>
    {resource.description && <p>{resource.description}</p>}
    {isDownloadUrl(resource.downloadUrl) ? <a className={['ZIP', 'RAR'].includes(resource.format?.toUpperCase() ?? '') ? 'bouton bouton-principal' : 'pdf-button'} href={resource.downloadUrl} download>
      Download{resource.format ? ` ${resource.format}` : ''}
    </a> : <p>File unavailable</p>}
  </div>
}

export default async function Downloads() {
  await connection()
  const data = await loadDownloads()
  // Assignment files live in a dedicated directory, independently of their format.
  const assignments = data?.resources.filter((r) => r.downloadUrl.startsWith('/downloads/assignments/')) ?? []
  const resources = data?.resources.filter((r) => !r.downloadUrl.startsWith('/downloads/assignments/')) ?? []
  const documents = resources.filter((r) => r.format?.toUpperCase() === 'PDF')
  const software = resources.filter((r) => ['ZIP', 'RAR'].includes(r.format?.toUpperCase() ?? ''))
  const other = resources.filter((r) => !['PDF','ZIP','RAR'].includes(r.format?.toUpperCase() ?? ''))
  return <><SiteHeader active="downloads" /><main>
    <section className="entete-page"><div className="container"><p className="surtitre">Learning Resources</p>
      <h1>{data?.page?.title ?? 'Downloads'}</h1>{data?.page?.content && <RichText data={data.page.content} />}
    </div></section>
    <section className="section"><div className="container">
      {!data ? <div role="status"><h2>Resources are temporarily unavailable</h2><p>Please try again later.</p></div>
      : data.resources.length === 0 ? <h2>Resources will be available soon</h2>
      : <div className={`grille-contact ${styles.resources}`}>
        {documents.length > 0 && <article className="carte-contact carte-information"><p className="surtitre surtitre-sombre">PDF Resources</p><h2>Course Notes</h2>{documents.map((r) => <Resource key={r.id} resource={r} />)}</article>}
        {assignments.length > 0 && <article className="carte-contact carte-information"><p className="surtitre surtitre-sombre">Course Assignments</p><h2>Assignments</h2>{assignments.map((r) => <Resource key={r.id} resource={r} />)}</article>}
        <article className="carte-contact carte-information"><p className="surtitre surtitre-sombre">Video Resources</p><h2>Course Videos</h2><div className="encadre-information"><strong>Coming Soon</strong><p>Educational videos will be available here soon.</p></div></article>
        {software.length > 0 && <article className="carte-contact carte-information"><p className="surtitre surtitre-sombre">Simulation Software</p><h2>Orbits101</h2>{software.map((r) => <Resource key={r.id} resource={r} />)}</article>}
        {other.length > 0 && <article className="carte-contact carte-information"><h2>More resources</h2>{other.map((r) => <Resource key={r.id} resource={r} />)}</article>}
      </div>}
    </div></section>
  </main><SiteFooter /></>
}
