
import { getAccountLanguage } from '@/lib/account-language'
import { ProfileForm } from '@/components/ProfileForm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AuthPage } from '@/components/AuthPage'
import { logout } from '@/app/(frontend)/auth-actions'
import Link from 'next/link'
export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Mon compte"), robots: { index: false, follow: false } }
}
export default async function Page() {
  const { locale, t } = await getAccountLanguage()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') redirect('/connexion')
  return <AuthPage title={t("Mon compte")} description={t("Bienvenue dans votre espace SpaceOrbitLAB.")}>
    <section className="account-section" aria-labelledby="profile-title">      <h2 id="profile-title">{t("Paramètres du profil")}</h2>      <p className="auth-description">{t("Adresse de connexion")}</p><p className="account-email">{user.email}</p>      <ProfileForm locale={locale} name={user.name ?? ''} />    </section>    <section className="account-section" aria-labelledby="security-title">      <h2 id="security-title">{t("Sécurité du compte")}</h2>      <p className="auth-description">{t("Pour changer votre mot de passe, demandez un lien sécurisé envoyé à votre adresse courriel.")}</p>    </section>
    <nav className="auth-links"><Link href="/mot-de-passe-oublie">{t("Modifier mon mot de passe")}</Link><Link href="/">{t("Retour à l’accueil")}</Link></nav>
    <form action={logout}><button className="primary-button">{t("Se déconnecter de tous les appareils")}</button></form>
  </AuthPage>
}
