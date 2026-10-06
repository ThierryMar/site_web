
import { getAccountLanguage } from '@/lib/account-language'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
import Link from 'next/link'
export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Réinitialiser le mot de passe"), robots: { index: false, follow: false }, referrer: 'no-referrer' as const }
}
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { locale, t } = await getAccountLanguage()
  const { token } = await searchParams
  return <AuthPage title={t("Un nouveau départ")} description={t("Choisissez un nouveau mot de passe pour votre compte.")}>
    {typeof token === 'string' && /^[a-f0-9]{40}$/.test(token) ? <AuthForm locale={locale} mode="reset" token={token} /> : <p role="alert">{t("Ce lien est incomplet ou invalide.")}{' '}<Link href="/mot-de-passe-oublie">{t("Demander un nouveau lien")}</Link></p>}
  </AuthPage>
}
