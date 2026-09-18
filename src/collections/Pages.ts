import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  access: {
    read: ({ req }) => req.user?.collection === 'admins' ? true : { _status: { equals: 'published' } },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'content', type: 'richText' },
  ],
}
