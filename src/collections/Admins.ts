import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000 },
  admin: { useAsTitle: 'email' },
  access: { admin: ({ req }) => req.user?.collection === 'admins', create: isAdmin, read: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [{ name: 'name', type: 'text' }],
}
