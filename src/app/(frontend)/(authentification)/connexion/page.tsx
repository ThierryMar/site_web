import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'
export const metadata = { title: 'Heureux de vous revoir' }
export default function Page() {
  return <AuthPage title={'Heureux de vous revoir'} description={'Connectez-vous pour retrouver votre espace personnel.'}><AuthForm mode="login" /></AuthPage>
}
