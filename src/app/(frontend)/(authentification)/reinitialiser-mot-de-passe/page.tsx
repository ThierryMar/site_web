import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
import Link from 'next/link'
export const metadata = { title: 'Réinitialiser le mot de passe', robots: { index: false, follow: false }, referrer: 'no-referrer' as const }
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  return <AuthPage title="Un nouveau départ" description="Choisissez un nouveau mot de passe pour votre compte.">
    {typeof token === 'string' && /^[a-f0-9]{40}$/.test(token) ? <AuthForm mode="reset" token={token} /> : <p role="alert">Ce lien est incomplet ou invalide. <Link href="/mot-de-passe-oublie">Demander un nouveau lien</Link></p>}
  </AuthPage>
}
