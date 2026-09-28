import { AuthPage } from '@/components/AuthPage'
import { AuthForm } from '@/components/AuthForm'

export const metadata = { title: 'Renvoyer la confirmation', robots: { index: false, follow: false } }

export default function Page() {
  return <AuthPage title="Recevoir un nouveau lien" description="Saisissez l’adresse utilisée lors de votre inscription. Vérifiez aussi vos courriels indésirables."><AuthForm mode="resend" /></AuthPage>
}
