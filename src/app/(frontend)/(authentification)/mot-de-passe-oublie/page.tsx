
import { getAccountLanguage } from '@/lib/account-language'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Mot de passe oublié ?") }
}
export default async function Page() {
  const { locale, t } = await getAccountLanguage()
  return <AuthPage title={t("Mot de passe oublié ?")} description={t("Indiquez votre adresse courriel pour recevoir un lien de récupération.")}><AuthForm locale={locale} mode="forgot" /></AuthPage>
}
