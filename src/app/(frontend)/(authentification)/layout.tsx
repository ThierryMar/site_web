
import { getAccountLanguage } from '@/lib/account-language'
import Link from 'next/link'

export default async function AuthentificationLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getAccountLanguage()
  return <main className="auth-page" lang={locale}>
    <Link className="brand" href="/">SpaceOrbitLAB</Link>
    <div className="account-navigation">
      <Link href="/">{t("Accueil")}</Link>
      <details className="account-menu">
        <summary>{t("Compte")}{' '}<span aria-hidden="true">▾</span></summary>
        <div className="account-menu-links">
          <Link href="/connexion">{t("Se connecter")}</Link>
          <Link href="/inscription">{t("Créer un compte")}</Link>
          <Link href="/mon-compte">{t("Mon compte et paramètres")}</Link>
        </div>
      </details>
    </div>
    <section className="auth-card">
      <p className="auth-eyebrow">{t("VOTRE ESPACE D’EXPLORATION")}</p>
      {children}
    </section>
    <footer>{t("SpaceOrbitLAB · Formation en sciences spatiales")}</footer>
  </main>
}
