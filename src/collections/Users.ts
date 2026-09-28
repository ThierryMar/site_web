import { APIError, Forbidden, type CollectionConfig } from 'payload'
import { adminOrSelf, isAdmin } from '../access'
import { authEmailHTML, verificationSubject } from '../lib/auth-emails'
import { validPassword } from '../lib/auth-validation'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
    verify: {
      generateEmailSubject: () => verificationSubject,
      generateEmailHTML: ({ token }) => authEmailHTML('verify', token),
    },
    forgotPassword: {
      expiration: 3600000,
      generateEmailSubject: () => 'Réinitialiser votre mot de passe — SpaceOrbitLAB',
      generateEmailHTML: ({ token } = {}) => authEmailHTML('reset', token || ''),
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
    beforeOperation: [({ operation, args }) => {
      if (operation === 'resetPassword' && !validPassword(args.data.password)) {
        throw new APIError('Le mot de passe doit contenir entre 12 et 128 caractères.', 400)
      }
      return args
    }],
    // Payload also calls beforeLogin when resetting a password through REST.
    beforeLogin: [({ user }) => {
      if (!user._verified) throw new Forbidden()
      return user
    }],
    afterOperation: [async ({ operation, result, req }) => {
      if (operation === 'resetPassword') {
        if (typeof result.user.id !== 'number' && typeof result.user.id !== 'string') throw new Error('Invalid user ID')
        await req.payload.update({ collection: 'users', id: result.user.id, data: { sessions: [] }, req, overrideAccess: true })
        return { ...result, token: undefined, user: { ...result.user, sessions: [] } }
      }
      return result
    }],
    beforeChange: [({ operation, req, data }) => {
      // Payload's first-register endpoint bypasses create access rules.
      // Only the admins collection may use public first-user bootstrapping.
      if (operation === 'create' && req.user?.collection !== 'admins' && req.context.publicSignup !== true) {
        throw new Forbidden()
      }
      if (operation === 'create') {
        data.verificationEmailSentAt = new Date().toISOString()
        if (req.context.publicSignup === true) data._verified = false
      }
      return data
    }],
  },
  fields: [
    { name: 'name', type: 'text' },
    // A verified student must not replace their email through the generic API.
    { name: 'email', type: 'email', required: true, access: { update: ({ req }) => req.user?.collection === 'admins' } },
    { name: '_verified', type: 'checkbox', access: {
      create: ({ req }) => req.user?.collection === 'admins',
      update: ({ req }) => req.user?.collection === 'admins',
    } },
    { name: '_verificationToken', type: 'text', hidden: true, access: { read: () => false, create: () => false, update: () => false } },
    { name: 'verificationEmailSentAt', type: 'date', hidden: true, access: { read: () => false, create: () => false, update: () => false } },
  ],
}
