import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export const metadata = { title: 'Créez votre compte' }
export default function Page() {
  return <AuthPage title={'Créez votre compte'} description={'Une adresse courriel et un mot de passe suffisent pour commencer.'}><AuthForm mode="signup" /></AuthPage>
}
