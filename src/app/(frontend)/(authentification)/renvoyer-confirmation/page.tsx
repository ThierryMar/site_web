
import { getAccountLanguage } from '@/lib/account-language'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'

export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Renvoyer la confirmation"), robots: { index: false, follow: false } }
}

export default async function Page() {
  const { locale, t } = await getAccountLanguage()
  return <AuthPage title={t("Recevoir un nouveau lien")} description={t("Saisissez l’adresse utilisée lors de votre inscription. Vérifiez aussi vos courriels indésirables.")}><AuthForm locale={locale} mode="resend" /></AuthPage>
}
