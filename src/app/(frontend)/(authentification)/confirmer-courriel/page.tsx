import Link from 'next/link'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'

export const metadata = { title: 'Confirmer mon adresse courriel', robots: { index: false, follow: false }, referrer: 'no-referrer' as const }

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  return <AuthPage title="Confirmez votre adresse courriel" description="Cliquez sur le bouton pour activer votre compte SpaceOrbitLAB.">
    {typeof token === 'string' && /^[a-f0-9]{40}$/.test(token)
      ? <AuthForm mode="verify" token={token} />
      : <p role="alert">Ce lien est incomplet ou invalide. <Link href="/renvoyer-confirmation">Demander un nouveau lien</Link></p>}
  </AuthPage>
}
