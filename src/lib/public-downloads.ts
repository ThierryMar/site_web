import type { Payload } from 'payload'

/** Explicit anonymous access also applies when a logged-in administrator visits the public page. */
export async function readPublicDownloads(payload: Pick<Payload, 'find'>) {
  const [resources, pages] = await Promise.all([
    payload.find({
      collection: 'downloads', overrideAccess: false, user: null, draft: false,
      where: { _status: { equals: 'published' } },
      sort: ['order', 'title'], pagination: false, depth: 0,
    }),
    payload.find({
      collection: 'pages', overrideAccess: false, user: null, draft: false,
      where: { and: [{ slug: { equals: 'downloads' } }, { _status: { equals: 'published' } }] },
      limit: 1, depth: 0,
    }),
  ])
  return { resources: resources.docs, page: pages.docs[0] ?? null }
}
