import { Forbidden, type CollectionConfig } from 'payload'
import { adminOrSelf, isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
    forgotPassword: {
      expiration: 3600000,
      generateEmailSubject: () => 'Réinitialiser votre mot de passe — SpaceOrbitLAB',
      generateEmailHTML: ({ token } = {}) => {
        const url = new URL('/reinitialiser-mot-de-passe', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')
        url.searchParams.set('token', token || '')
        return `<h1>Réinitialiser votre mot de passe</h1><p>Ce lien est valable une heure.</p><p><a href="${url.href}">Choisir un nouveau mot de passe</a></p><p>Si vous n’avez pas fait cette demande, ignorez ce message.</p>`
      },
    },
  },
  admin: { useAsTitle: 'email' },
  access: {
    admin: () => false,
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [({ operation, req, data }) => {
      // Payload's first-register endpoint bypasses create access rules.
      // Only the admins collection may use public first-user bootstrapping.
      if (operation === 'create' && req.user?.collection !== 'admins' && req.context.publicSignup !== true) {
        throw new Forbidden()
      }
      return data
    }],
  },
  fields: [{ name: 'name', type: 'text' }],
}
