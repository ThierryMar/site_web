import Link from 'next/link'
import Image from 'next/image'
import { connection } from 'next/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { loadMarketing } from '@/lib/load-marketing'
import type { MarketingPage as PageSlug } from '@/lib/public-marketing'
import { isDownloadUrl } from '@/lib/download-url'
import { exampleCoursePath, exampleCourseSlug } from '@/lib/course-catalog'
import { findCourseImage } from '@/lib/course-images'
import './course-preview.css'

export async function MarketingPage({ slug }: { slug: PageSlug }) {
  await connection()
  const data = await loadMarketing(slug)
  const title = data?.page?.title ?? (slug === 'introduction' ? 'Introduction' : 'Courses')
  return <>
    <SiteHeader active={slug} />
    <main>
      <section className="entete-page"><div className="container">
        <p className="surtitre">{slug === 'introduction' ? 'Starting Point' : 'Training Program'}</p>
        <h1>{title}</h1>{data?.page?.content && <RichText data={data.page.content} />}
      </div></section>
      <section className="section contenu-page">
        {!data ? <div className="container" role="status"><h2>Content is temporarily unavailable</h2><p>Please try again later.</p><Link href={`/${slug}`} prefetch={false}>Try again</Link></div>
        : data.sections.length === 0 ? <div className="container"><h2>Content will be available soon</h2></div>
        : <div className="container grille-contenu">
          <aside className="sommaire" role="navigation" aria-label="On this page"><p>{slug === 'courses' ? 'Courses' : 'On This Page'}</p>
            {data.sections.map((section) => <a key={section.id} href={`#${encodeURIComponent(section.slug)}`}>{section.title}</a>)}
          </aside>
          <article className="article-principal">
            {data.sections.map((section, index) => <section id={section.slug} key={section.id}>
              {slug === 'courses' && <p className="surtitre surtitre-sombre">Course {String(index + 1).padStart(2, '0')}</p>}
              <h2>{section.title}</h2>
              {'summary' in section && <p>{section.summary}</p>}
              {'subtitle' in section && section.subtitle && <p>{section.subtitle}</p>}
              {section.content && <RichText data={section.content} />}
              {slug === 'courses' && section.slug === exampleCourseSlug && <div className="course-preview-figures">{['image33-png', 'image51-png'].map((id) => {
                const figure = findCourseImage(id)!
                return <figure key={id}><Image src={`/course-previews/astrodynamics-laws/${id}.webp`} alt={figure.alt} width={figure.width} height={figure.height} /><figcaption>{figure.caption}<br /><span>Source presentation, slide {figure.slides[0]}</span></figcaption></figure>
              })}</div>}
              {slug === 'courses' && section.slug === exampleCourseSlug && <div className="course-preview-access"><Link className="bouton bouton-principal" href={exampleCoursePath}>Open the complete module</Link><p>Available in Dashboard → My courses. Sign in or <Link href="/inscription">create an account</Link> to read the lessons.</p></div>}
              {'ctaUrl' in section && section.ctaLabel && isDownloadUrl(section.ctaUrl) && <a className="bouton bouton-principal" href={section.ctaUrl!}>{section.ctaLabel}</a>}
            </section>)}
          </article>
        </div>}
      </section>
    </main><SiteFooter />
  </>
}
