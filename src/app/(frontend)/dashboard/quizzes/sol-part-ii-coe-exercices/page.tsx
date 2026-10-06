import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DashboardShell } from '@/components/DashboardShell'
import { CoeExercises } from '@/components/learning/CoeExercises'
import { getAccountLanguage } from '@/lib/account-language'
import '../../dashboard.css'

export const metadata: Metadata = { title: 'SOL Part II - COE exercices', robots: { index: false, follow: false } }

export default async function CoeQuizPage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') redirect('/connexion')
  const { locale, t } = await getAccountLanguage()
  return <DashboardShell section="quizzes" name={user.name ?? ''} email={user.email}>
    <Link className="dashboard-text-link" href="/dashboard?section=quizzes">← {t('Mes quiz')}</Link>
    <div className="dashboard-heading"><h1>SOL Part II - COE exercices</h1></div>
    <CoeExercises english={locale === 'en'} />
  </DashboardShell>
}
