import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export const metadata = { title: 'Créez votre compte' }
export default function Page() {
  return <AuthPage title={'Créez votre compte'} description={'Un lien vous sera envoyé pour confirmer votre adresse courriel avant votre première connexion.'}><AuthForm mode="signup" /></AuthPage>
}
