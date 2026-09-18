'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { authenticate } from '@/app/(frontend)/auth-actions'

export function AuthForm({ mode, token = '' }: { mode: 'login' | 'signup' | 'forgot' | 'reset'; token?: string }) {
  const [state, action, pending] = useActionState(authenticate.bind(null, mode, token), {})
  const newPassword = mode === 'signup' || mode === 'reset'
  const labels = { login: 'Se connecter', signup: 'Créer mon compte', forgot: 'Envoyer le lien', reset: 'Enregistrer le mot de passe' }
  return <>
    {state.success ? <div role="status" className="auth-success"><p>{state.success}</p><Link href="/connexion">Retour à la connexion</Link></div> :
      <form action={action} className="auth-form">
        {mode !== 'reset' && <label htmlFor="email">Adresse courriel<input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="vous@exemple.com" /></label>}
        {mode !== 'forgot' && <label htmlFor="password">{newPassword ? 'Nouveau mot de passe' : 'Mot de passe'}<input id="password" name="password" type="password" autoComplete={newPassword ? 'new-password' : 'current-password'} required minLength={newPassword ? 12 : undefined} maxLength={128} aria-describedby={newPassword ? 'password-help' : undefined} /></label>}
        {newPassword && <><p id="password-help" className="auth-hint">Entre 12 et 128 caractères. Vous pouvez utiliser une phrase facile à retenir.</p><label htmlFor="confirmation">Confirmer le mot de passe<input id="confirmation" name="confirmation" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label></>}
        {state.error && <p className="auth-error" role="alert">{state.error}</p>}
        <button className="primary-button" disabled={pending}>{pending ? 'Veuillez patienter…' : labels[mode]}</button>
      </form>}
    <nav className="auth-links" aria-label="Authentification">
      {mode === 'login' ? <><Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link><span>Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></span></> : <Link href="/connexion">Déjà un compte ? Se connecter</Link>}
      {mode === 'reset' && <Link href="/mot-de-passe-oublie">Demander un nouveau lien</Link>}
    </nav>
  </>
}
