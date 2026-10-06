
import { getAccountLanguage } from '@/lib/account-language'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Créez votre compte") }
}
export default async function Page() {
  const { locale, t } = await getAccountLanguage()
  return <AuthPage title={t("Créez votre compte")} description={t("Un lien vous sera envoyé pour confirmer votre adresse courriel avant votre première connexion.")}><AuthForm locale={locale} mode="signup" /></AuthPage>
}
