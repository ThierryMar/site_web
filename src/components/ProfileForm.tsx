'use client'

import { accountTranslator, type AccountLocale } from '@/lib/account-locale'
import { useActionState } from 'react'
import { updateProfile } from '@/app/(frontend)/auth-actions'

export function ProfileForm({ name, locale }: { name: string; locale: AccountLocale }) {
  const t = accountTranslator(locale)
  const [state, action, pending] = useActionState(updateProfile, {})
  return <form className="auth-form" action={action}>
    <label htmlFor="profile-name">{t("Nom affiché")}<input id="profile-name" name="name" autoComplete="name" maxLength={100} defaultValue={name} /></label>
    {state.error && <p className="auth-error" role="alert">{state.error}</p>}
    {state.success && <p className="auth-success" role="status">{state.success}</p>}
    <button className="primary-button" disabled={pending}>{pending ? t("Enregistrement…") : t("Enregistrer mon profil")}</button>
  </form>
}
