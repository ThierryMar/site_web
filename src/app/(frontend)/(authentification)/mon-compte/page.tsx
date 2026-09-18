import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AuthPage } from '@/components/AuthPage'
import { logout } from '@/app/(frontend)/auth-actions'
import Link from 'next/link'
export const metadata = { title: 'Mon compte', robots: { index: false, follow: false } }
export default async function Page() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') redirect('/connexion')
  return <AuthPage title="Mon compte" description="Bienvenue dans votre espace SpaceOrbitLAB.">
    <p className="account-email">{user.email}</p><p className="auth-description">Votre compte est prêt. Les formations seront bientôt disponibles.</p>
    <nav className="auth-links"><Link href="/mot-de-passe-oublie">Modifier mon mot de passe</Link><Link href="/">Retour à l’accueil</Link></nav>
    <form action={logout}><button className="primary-button">Se déconnecter de tous les appareils</button></form>
  </AuthPage>
}
