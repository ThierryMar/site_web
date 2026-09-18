import type { CollectionConfig } from 'payload'
import { marketingAccess, titleFields, urlField } from './contentFields'
import { isDownloadUrl } from '../lib/download-url'

const marketing = {
  admin: { group: 'Site marketing', useAsTitle: 'title', defaultColumns: ['title', 'order', '_status'] },
  access: marketingAccess,
  versions: { drafts: true },
  defaultSort: 'order',
} satisfies Partial<CollectionConfig>

export const Intro: CollectionConfig = {
  ...marketing,
  slug: 'intro',
  labels: { singular: 'Intro', plural: 'Intro' },
  fields: [
    ...titleFields(),
    { name: 'subtitle', label: 'Sous-titre', type: 'textarea' },
    { name: 'content', label: 'Contenu', type: 'richText' },
    { name: 'ctaLabel', label: 'Texte du bouton', type: 'text' },
    urlField('ctaUrl', 'Lien du bouton'),
  ],
}

export const CourseOverviews: CollectionConfig = {
  ...marketing,
  slug: 'course-overviews',
  labels: { singular: 'Cours (Aperçu)', plural: 'Cours (Aperçu)' },
  fields: [
    ...titleFields(),
    { name: 'summary', label: 'Résumé', type: 'textarea', required: true },
    { name: 'content', label: 'Présentation', type: 'richText' },
    { name: 'course', label: 'Cours associé', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'level', label: 'Niveau', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
    { name: 'durationMinutes', label: 'Durée (minutes)', type: 'number', min: 0 },
  ],
}

export const Downloads: CollectionConfig = {
  ...marketing,
  slug: 'downloads',
  labels: { singular: 'Ressource (Download)', plural: 'Ressources (Downloads)' },
  fields: [
    ...titleFields(),
    { name: 'description', type: 'textarea' },
    {
      name: 'downloadUrl', label: 'URL du fichier à télécharger', type: 'text', required: true,
      admin: { description: 'URL HTTP(S) ou chemin local commençant par /, par exemple /legacy/Fichiers/document.pdf. Encoder les espaces avec %20.' },
      validate: (value: unknown) => isDownloadUrl(value) || 'Utilisez une URL HTTP(S) ou un chemin local valide.',
    },
    { name: 'format', label: 'Format du fichier', type: 'text' },
  ],
}

export const Simulations: CollectionConfig = {
  ...marketing,
  slug: 'simulations',
  labels: { singular: 'Simulation', plural: 'Simulations' },
  fields: [
    ...titleFields(),
    { name: 'description', type: 'textarea' },
    { name: 'instructions', type: 'richText' },
    urlField('simulationUrl', 'URL de la simulation', true),
  ],
}
