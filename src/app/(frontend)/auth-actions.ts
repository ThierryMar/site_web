'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validEmail, validPassword } from '@/lib/auth-validation'

export type AuthState = { error?: string; success?: string }
export async function authenticate(mode: string, token: string, _state: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') || '').trim().toLowerCase()
  const password = String(form.get('password') || '')
  if (!['login', 'signup', 'forgot', 'reset'].includes(mode)) return { error: 'Demande invalide.' }
  if (mode !== 'reset' && !validEmail(email)) return { error: 'Saisissez une adresse courriel valide.' }
  if (['signup', 'reset'].includes(mode)) {
    if (!validPassword(password)) return { error: 'Le mot de passe doit contenir entre 12 et 128 caractères.' }
    if (password !== form.get('confirmation')) return { error: 'Les mots de passe ne correspondent pas.' }
  }
  if (mode === 'login' && (!password || password.length > 128)) return { error: 'Courriel ou mot de passe incorrect.' }
  if (mode === 'reset' && !/^[a-f0-9]{40}$/.test(token)) return { error: 'Lien invalide. Demandez un nouveau lien de récupération.' }
  try {
    const payload = await getPayload({ config })
    if (mode === 'forgot') {
      if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return { error: 'La récupération par courriel est temporairement indisponible.' }
      try {
        await payload.forgotPassword({ collection: 'users', data: { email } })
      } catch {
        payload.logger.error('Password recovery email could not be delivered.')
      }
      return { success: 'Si un compte correspond à cette adresse, un lien de récupération vous sera envoyé. Vérifiez aussi vos courriels indésirables.' }
    }
    if (mode === 'signup') {
      await payload.create({ collection: 'users', data: { email, password }, context: { publicSignup: true } })
      return { success: 'Votre compte a été créé. Vous pouvez maintenant vous connecter.' }
    }
    if (mode === 'reset') {
      const result = await payload.resetPassword({ collection: 'users', data: { token, password }, overrideAccess: true })
      if (typeof result.user.id !== 'number' && typeof result.user.id !== 'string') throw new Error('Invalid user ID')
      // Revoke existing sessions, including the session created by resetPassword.
      await payload.update({ collection: 'users', id: result.user.id, data: { sessions: [] } })
      return { success: 'Votre mot de passe a été modifié. Connectez-vous avec votre nouveau mot de passe.' }
    }
    const result = await payload.login({ collection: 'users', data: { email, password } })
    if (!result.token) return { error: 'Connexion impossible. Réessayez.' }
    ;(await cookies()).set(`${payload.config.cookiePrefix}-token`, result.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7200,
    })
  } catch {
    return { error: mode === 'login' ? 'Courriel ou mot de passe incorrect, ou compte temporairement verrouillé. Réessayez plus tard.' : mode === 'reset' ? 'Ce lien est invalide ou expiré. Demandez un nouveau lien.' : 'Impossible de créer ce compte. Si vous êtes déjà inscrit, connectez-vous ou réinitialisez votre mot de passe.' }
  }
  redirect('/mon-compte')
}

export async function logout() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.collection === 'users') await payload.update({ collection: 'users', id: user.id, data: { sessions: [] } })
  ;(await cookies()).delete(`${payload.config.cookiePrefix}-token`)
  redirect('/connexion')
}
