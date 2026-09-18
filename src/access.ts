import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'
export const adminOrSelf: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection === 'users') return { id: { equals: req.user.id } }
  return false
}
