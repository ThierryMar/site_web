'use server'

import { getAccountLanguage } from '@/lib/account-language'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validEmail, validPassword } from '@/lib/auth-validation'
import { resendVerification } from '@/lib/resend-verification'
import { USER_SESSION_MAX_AGE } from '@/lib/auth-session'

export type AuthState = { error?: string; success?: string }
export async function authenticate(mode: string, token: string, _state: AuthState, form: FormData): Promise<AuthState> {
  const { t } = await getAccountLanguage()
  const email = String(form.get('email') || '').trim().toLowerCase()
  const password = String(form.get('password') || '')
  if (!['login', 'signup', 'forgot', 'reset', 'verify', 'resend'].includes(mode)) return { error: t("Demande invalide.") }
  if (!['reset', 'verify'].includes(mode) && !validEmail(email)) return { error: t("Saisissez une adresse courriel valide.") }
  if (['signup', 'reset'].includes(mode)) {
    if (!validPassword(password)) return { error: t("Le mot de passe doit contenir entre 12 et 128 caractères.") }
    if (password !== form.get('confirmation')) return { error: t("Les mots de passe ne correspondent pas.") }
  }
  if (mode === 'login' && (!password || password.length > 128)) return { error: t("Courriel ou mot de passe incorrect.") }
  if (['reset', 'verify'].includes(mode) && !/^[a-f0-9]{40}$/.test(token)) return { error: t("Lien invalide. Demandez un nouveau lien.") }
  if (['signup', 'forgot', 'resend'].includes(mode) && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)) {
    return { error: t("L’envoi de courriels est temporairement indisponible. Réessayez plus tard.") }
  }
  try {
    const payload = await getPayload({ config })
    if (mode === 'verify') {
      await payload.verifyEmail({ collection: 'users', token })
      return { success: t("Votre adresse courriel est confirmée. Vous pouvez maintenant vous connecter.") }
    }
    if (mode === 'resend') {
      try {
        await resendVerification(payload, email)
      } catch {
        payload.logger.error('Verification email could not be delivered.')
      }
      return { success: t("Si cette adresse correspond à un compte à confirmer, un lien vous sera envoyé. Vérifiez vos indésirables et attendez une minute avant une nouvelle demande.") }
    }
    if (mode === 'forgot') {
      if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return { error: t("La récupération par courriel est temporairement indisponible.") }
      try {
        await payload.forgotPassword({ collection: 'users', data: { email } })
      } catch {
        payload.logger.error('Password recovery email could not be delivered.')
      }
      return { success: t("Si un compte correspond à cette adresse, un lien de récupération vous sera envoyé. Vérifiez aussi vos courriels indésirables.") }
    }
    if (mode === 'signup') {
      await payload.create({ collection: 'users', data: { email, password }, context: { publicSignup: true } })
      return { success: t("Votre compte a été créé. Consultez vos courriels et confirmez votre adresse avant de vous connecter. Vérifiez aussi vos indésirables.") }
    }
    if (mode === 'reset') {
      await payload.resetPassword({ collection: 'users', data: { token, password }, overrideAccess: true })
      return { success: t("Votre mot de passe a été modifié. Connectez-vous avec votre nouveau mot de passe.") }
    }
    const result = await payload.login({ collection: 'users', data: { email, password } })
    if (!result.token) return { error: t("Connexion impossible. Réessayez.") }
    ;(await cookies()).set(`${payload.config.cookiePrefix}-token`, result.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: USER_SESSION_MAX_AGE,
    })
  } catch {
    return { error: mode === 'login'
      ? t("Connexion impossible. Vérifiez vos identifiants et confirmez votre adresse courriel. Après plusieurs échecs, attendez dix minutes.")
      : mode === 'verify' ? t("Ce lien est invalide ou a déjà été utilisé. Essayez de vous connecter ou demandez un nouveau lien de confirmation.")
      : mode === 'reset' ? t("Ce lien est invalide ou expiré, ou votre adresse reste à confirmer. Confirmez votre adresse puis demandez un nouveau lien de récupération.")
      : t("Impossible de créer ce compte. Si vous êtes déjà inscrit, connectez-vous ou demandez un nouveau lien de confirmation.") }
  }
  redirect('/dashboard')
}

export async function logout() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.collection === 'users') await payload.update({ collection: 'users', id: user.id, data: { sessions: [] } })
  ;(await cookies()).delete(`${payload.config.cookiePrefix}-token`)
  redirect('/connexion')
}

export async function updateProfile(_state: AuthState, form: FormData): Promise<AuthState> {
  const { t } = await getAccountLanguage()
  const name = String(form.get('name') || '').trim()
  if (name.length > 100 || /[\u0000-\u001f]/.test(name)) return { error: t("Le nom doit contenir au maximum 100 caractères, sans caractères de contrôle.") }
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || user.collection !== 'users') return { error: t("Connectez-vous pour modifier votre profil.") }
    await payload.update({ collection: 'users', id: user.id, data: { name }, overrideAccess: false, user })
    revalidatePath('/dashboard')
    revalidatePath('/mon-compte')
    return { success: t("Votre profil a été enregistré.") }
  } catch {
    return { error: t("Impossible d’enregistrer le profil. Réessayez.") }
  }
}
