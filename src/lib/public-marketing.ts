import type { Payload } from 'payload'

export type MarketingPage = 'introduction' | 'courses'

/** Never forward the visitor's admin session or expand private course relationships. */
export async function readPublicMarketing(payload: Pick<Payload, 'find'>, slug: MarketingPage) {
  const [sections, pages] = await Promise.all([
    payload.find({
      collection: slug === 'introduction' ? 'intro' : 'course-overviews',
      overrideAccess: false, user: null, draft: false,
      where: { _status: { equals: 'published' } },
      sort: ['order', 'title'], pagination: false, depth: 0,
    }),
    payload.find({
      collection: 'pages', overrideAccess: false, user: null, draft: false,
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1, depth: 0,
    }),
  ])
  return { sections: sections.docs, page: pages.docs[0] ?? null }
}
