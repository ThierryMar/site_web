
import { getAccountLanguage } from '@/lib/account-language'
import Link from 'next/link'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'

export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Confirmer mon adresse courriel"), robots: { index: false, follow: false }, referrer: 'no-referrer' as const }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { locale, t } = await getAccountLanguage()
  const { token } = await searchParams
  return <AuthPage title={t("Confirmez votre adresse courriel")} description={t("Cliquez sur le bouton pour activer votre compte SpaceOrbitLAB.")}>
    {typeof token === 'string' && /^[a-f0-9]{40}$/.test(token)
      ? <AuthForm locale={locale} mode="verify" token={token} />
      : <p role="alert">{t("Ce lien est incomplet ou invalide.")}{' '}<Link href="/renvoyer-confirmation">{t("Demander un nouveau lien")}</Link></p>}
  </AuthPage>
}
