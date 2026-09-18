import type { CollectionConfig, Field } from 'payload'
import { isAdmin } from '../access'

export const marketingAccess: CollectionConfig['access'] = {
  read: ({ req }) => req.user?.collection === 'admins' ? true : { _status: { equals: 'published' } },
  readVersions: isAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

// Student access will be added alongside course enrollments.
export const courseAccess: CollectionConfig['access'] = {
  read: isAdmin, readVersions: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin,
}

export const titleFields = (): Field[] => [
  { name: 'title', label: 'Titre', type: 'text', required: true },
  { name: 'slug', type: 'text', required: true, unique: true, index: true },
  { name: 'order', label: 'Ordre', type: 'number', defaultValue: 0, required: true },
]

export const courseField = (): Field => ({
  name: 'course', label: 'Cours', type: 'relationship', relationTo: 'courses', required: true, index: true,
})

export const urlField = (name: string, label: string, required = false): Field => ({
  name, label, type: 'text', required,
  validate: (value: unknown) => {
    if (!value) return required ? 'Une URL est requise.' : true
    try {
      const url = new URL(String(value))
      return ['https:', 'http:'].includes(url.protocol) || 'Utilisez une URL HTTP ou HTTPS.'
    } catch {
      return 'Utilisez une URL HTTP ou HTTPS valide.'
    }
  },
})
