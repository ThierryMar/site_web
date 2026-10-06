
import { getAccountLanguage } from '@/lib/account-language'
import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export async function generateMetadata() {
  const { t } = await getAccountLanguage()
  return { title: t("Heureux de vous revoir") }
}
export default async function Page() {
  const { locale, t } = await getAccountLanguage()
  return <AuthPage title={t("Heureux de vous revoir")} description={t("Connectez-vous pour retrouver votre espace personnel.")}><AuthForm locale={locale} mode="login" /></AuthPage>
}
