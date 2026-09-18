import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteHeader } from '@/components/SiteHeader'
import { loadDownloads } from '@/lib/load-downloads'
import { isDownloadUrl } from '@/lib/download-url'
import type { Download } from '@/payload-types'
import './downloads.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: 'Downloads',
  description: 'Download SpaceOrbitLAB course notes, astrodynamics references, and the Orbits101 simulator.',
  alternates: { canonical: '/downloads' },
}

function Resource({ resource }: { resource: Download }) {
  return (
    <li className="download-resource">
      <div>
        <h3>{resource.title}</h3>
        {resource.description && <p>{resource.description}</p>}
      </div>
      {isDownloadUrl(resource.downloadUrl) ? (
        <a className="download-link" href={resource.downloadUrl} download aria-label={`Download ${resource.title}${resource.format ? ` (${resource.format})` : ''}`}>
          Download{resource.format ? ` ${resource.format}` : ''}<span aria-hidden="true">↓</span>
        </a>
      ) : <span className="download-pending">File unavailable</span>}
    </li>
  )
}

export default async function Downloads() {
  await connection()
  const data = await loadDownloads()
  const documents = data?.resources.filter((resource) => resource.format?.toUpperCase() === 'PDF') ?? []
  const software = data?.resources.filter((resource) => resource.format?.toUpperCase() === 'ZIP') ?? []
  const other = data?.resources.filter((resource) => !['PDF', 'ZIP'].includes(resource.format?.toUpperCase() ?? '')) ?? []

  return (
    <main className="downloads-page">
      <a className="skip-downloads" href="#download-content">Skip to resources</a>
      <SiteHeader active="downloads" />
      <div className="downloads-heading">
        <h1>{data?.page?.title ?? 'Downloads'}</h1>
        {data?.page?.content && <RichText className="downloads-intro" data={data.page.content} />}
      </div>
      <div id="download-content">
        {!data ? (
          <div className="downloads-message" role="status">
            <h2>Resources are temporarily unavailable</h2>
            <p>Please try again later.</p>
            <Link href="/downloads" prefetch={false}>Try again</Link>
          </div>
        ) : data.resources.length === 0 ? (
          <div className="downloads-message"><h2>Resources will be available soon</h2><p>Published course notes and software will appear here.</p></div>
        ) : (
          <>
            {documents.length > 0 && <section className="download-section" aria-labelledby="notes-title">
              <div className="download-section-title"><h2 id="notes-title">Course notes & references</h2><span>PDF documents</span></div>
              <ul className="download-list">{documents.map((resource) => <Resource key={resource.id} resource={resource} />)}</ul>
            </section>}
            {software.length > 0 && <section className="download-section download-software" aria-labelledby="software-title">
              <div className="download-section-title"><h2 id="software-title">Simulation software</h2><span>ZIP archives</span></div>
              <ul className="download-list">{software.map((resource) => <Resource key={resource.id} resource={resource} />)}</ul>
            </section>}
            {other.length > 0 && <section className="download-section" aria-labelledby="other-title">
              <h2 id="other-title">More resources</h2>
              <ul className="download-list">{other.map((resource) => <Resource key={resource.id} resource={resource} />)}</ul>
            </section>}
          </>
        )}
      </div>
      <footer className="downloads-footer"><span>SpaceOrbitLAB · Space sciences training</span><Link href="/">Return to home</Link></footer>
    </main>
  )
}
