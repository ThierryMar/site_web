import type { CollectionConfig } from 'payload'
import { courseAccess, courseField, titleFields, urlField } from './contentFields'

const learning = {
  admin: { group: 'Cours', useAsTitle: 'title', defaultColumns: ['title', 'course', 'order', '_status'] },
  access: courseAccess,
  versions: { drafts: true },
  defaultSort: 'order',
} satisfies Partial<CollectionConfig>

export const Courses: CollectionConfig = {
  ...learning,
  slug: 'courses',
  labels: { singular: 'Cours', plural: 'Cours' },
  admin: { ...learning.admin, defaultColumns: ['title', 'order', '_status'] },
  fields: [
    ...titleFields(),
    { name: 'description', type: 'richText' },
    { name: 'objectives', label: 'Objectifs pédagogiques', type: 'array', fields: [
      { name: 'objective', label: 'Objectif', type: 'text', required: true },
    ] },
    { name: 'lessons', label: 'Leçons', type: 'join', collection: 'lessons', on: 'course' },
    { name: 'resources', label: 'Ressources', type: 'join', collection: 'course-resources', on: 'course' },
    { name: 'exercises', label: 'Exercices', type: 'join', collection: 'exercises', on: 'course' },
    { name: 'quizzes', label: 'Quiz', type: 'join', collection: 'quizzes', on: 'course' },
  ],
}

export const Lessons: CollectionConfig = {
  ...learning,
  slug: 'lessons',
  labels: { singular: 'Leçon', plural: 'Leçons' },
  fields: [
    ...titleFields(), courseField(),
    { name: 'content', label: 'Contenu', type: 'richText', required: true },
    urlField('videoUrl', 'URL de la vidéo'),
    { name: 'durationMinutes', label: 'Durée (minutes)', type: 'number', min: 0 },
  ],
}

export const CourseResources: CollectionConfig = {
  ...learning,
  slug: 'course-resources',
  labels: { singular: 'Ressource', plural: 'Ressources' },
  fields: [
    ...titleFields(), courseField(),
    { name: 'description', type: 'textarea' },
    urlField('resourceUrl', 'URL de la ressource', true),
    { name: 'content', label: 'Contenu complémentaire', type: 'richText' },
  ],
}

export const Exercises: CollectionConfig = {
  ...learning,
  slug: 'exercises',
  labels: { singular: 'Exercice', plural: 'Exercices' },
  fields: [
    ...titleFields(), courseField(),
    { name: 'prompt', label: 'Énoncé', type: 'richText', required: true },
    { name: 'hint', label: 'Indice', type: 'richText' },
    { name: 'solution', label: 'Corrigé', type: 'richText', access: {
      read: ({ req }) => req.user?.collection === 'admins',
    } },
  ],
}

export const Quizzes: CollectionConfig = {
  ...learning,
  slug: 'quizzes',
  labels: { singular: 'Quiz', plural: 'Quiz' },
  fields: [
    ...titleFields(), courseField(),
    { name: 'instructions', type: 'richText' },
    { name: 'passingScore', label: 'Seuil de réussite (%)', type: 'number', min: 0, max: 100, defaultValue: 70, required: true },
    { name: 'questions', type: 'array', minRows: 1, required: true, fields: [
      { name: 'prompt', label: 'Question', type: 'textarea', required: true },
      { name: 'choices', label: 'Choix de réponse', type: 'array', minRows: 2, required: true, fields: [
        { name: 'text', label: 'Réponse', type: 'text', required: true },
        { name: 'isCorrect', label: 'Bonne réponse', type: 'checkbox', defaultValue: false, access: {
          read: ({ req }) => req.user?.collection === 'admins',
        } },
      ] },
      { name: 'explanation', label: 'Explication du corrigé', type: 'richText', access: {
        read: ({ req }) => req.user?.collection === 'admins',
      } },
    ] },
  ],
}
