import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export const metadata = { title: 'Mot de passe oublié ?' }
export default function Page() {
  return <AuthPage title={'Mot de passe oublié ?'} description={'Indiquez votre adresse courriel pour recevoir un lien de récupération.'}><AuthForm mode="forgot" /></AuthPage>
}
