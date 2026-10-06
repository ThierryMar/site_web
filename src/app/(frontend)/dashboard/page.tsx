
import { getAccountLanguage } from '@/lib/account-language'
import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { DashboardShell, dashboardSections } from '@/components/DashboardShell'
import { ProfileForm } from '@/components/ProfileForm'
import { CourseLibrary } from '@/components/learning/CourseLibrary'
import { QuizLibrary } from '@/components/learning/QuizLibrary'
import { loadDownloads } from '@/lib/load-downloads'
import { isDownloadUrl } from '@/lib/download-url'
import './dashboard.css'

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } }

const learningSections = {
  courses: { title: 'Mes cours', description: 'Retrouvez ici les formations de votre parcours.', empty: 'Votre parcours commence ici', detail: 'Vos cours et leurs leçons seront regroupés dans cet espace lorsque les inscriptions seront disponibles.' },
  lessons: { title: 'Mes leçons', description: 'Un espace pour retrouver vos leçons et reprendre votre apprentissage.', empty: 'Les leçons arrivent bientôt', detail: 'Les leçons de vos cours apparaîtront ici. En attendant, découvrez les thèmes des formations.' },
  progress: { title: 'Ma progression', description: 'Gardez une vue sur votre avancement, cours après cours.', empty: 'Votre progression prendra forme ici', detail: 'Le suivi des leçons terminées et des étapes de votre parcours sera disponible avec les formations.' },
  quizzes: { title: 'Mes quiz', description: 'Retrouvez vos évaluations et vos résultats au même endroit.', empty: 'Les quiz arrivent bientôt', detail: 'Les quiz et leurs résultats seront accessibles ici avec les formations. Aucun quiz n’est disponible pour le moment.' },
}

function OrbitDiagram() {
  return <svg className="dashboard-orbit" viewBox="0 0 320 260" fill="none" aria-hidden="true">
    <circle cx="160" cy="130" r="55" stroke="currentColor" strokeWidth="1" />
    <ellipse cx="160" cy="130" rx="146" ry="76" transform="rotate(-30 160 130)" stroke="currentColor" />
    <ellipse cx="160" cy="130" rx="116" ry="105" transform="rotate(30 160 130)" stroke="currentColor" strokeDasharray="3 8" />
    <path d="M105 130h110M160 75c-35 30-35 80 0 110 35-30 35-80 0-110Z" stroke="currentColor" />
    <circle cx="275" cy="55" r="7" fill="#D4A017" /><circle cx="160" cy="130" r="4" fill="currentColor" />
  </svg>
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ section?: string | string[] }> }) {
  const { locale, t } = await getAccountLanguage()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') redirect('/connexion')

  const requested = (await searchParams).section
  const section = dashboardSections.find((item) => item.id === requested)?.id ?? 'overview'
  const learning = section in learningSections ? learningSections[section as keyof typeof learningSections] : null
  const downloads = section === 'downloads' ? await loadDownloads() : null
  const librarySection = section === 'courses' || section === 'lessons' ? section : null

  return <DashboardShell section={section} name={user.name ?? ''} email={user.email}>
    {section === 'overview' && <>
      <div className="dashboard-heading"><h1>{user.name ? `${t("Bienvenue,")} ${user.name}` : t("Bienvenue dans votre espace")}</h1><p>{t("Votre point de départ pour explorer les sciences spatiales.")}</p></div>
      <section className="dashboard-welcome" aria-labelledby="journey-title">
        <div><span className="dashboard-status">{t("Votre espace de formation")}</span><h2 id="journey-title">{t("Votre prochaine étape")}<br />{t("vers les sciences spatiales.")}</h2><p>{t("Commencez le module Astrodynamics Laws : neuf leçons pour comprendre les lois de Kepler et de Newton, avec des exemples et un quiz d’entraînement.")}</p><Link className="dashboard-button" href="/dashboard?section=courses">{t("Ouvrir mes cours")}</Link></div><OrbitDiagram />
      </section>
      <div className="dashboard-overview-grid">
        <section className="dashboard-panel" aria-labelledby="learning-title"><div className="dashboard-section-heading"><h2 id="learning-title">{t("Mon apprentissage")}</h2><span className="dashboard-badge">{t("Premier module disponible")}</span></div><p>{t("Tout votre parcours, au même endroit.")}</p>
          <div className="dashboard-learning-list">{dashboardSections.filter((item) => ['courses', 'lessons', 'progress', 'quizzes'].includes(item.id)).map((item) => <Link key={item.id} href={`/dashboard?section=${item.id}`}><strong>{t(item.label)}</strong><span>{item.id === 'courses' ? t("Vos formations") : item.id === 'lessons' ? t("Vos prochaines étapes") : item.id === 'progress' ? t("Votre avancement") : t("Vos évaluations")}</span><span aria-hidden="true">↗</span></Link>)}</div>
        </section>
        <div className="dashboard-utilities"><section className="dashboard-resource-panel"><h2>{t("De quoi explorer dès maintenant")}</h2><p>{t("Notes de cours, références et outils de simulation : les ressources publiques sont déjà accessibles.")}</p><Link className="dashboard-text-link" href="/dashboard?section=downloads">{t("Ouvrir les téléchargements")}</Link></section>
          <section className="dashboard-account-summary"><h2>{t("Votre compte")}</h2><p>{user.email}</p><Link className="dashboard-text-link" href="/dashboard?section=account">{t("Gérer mon profil")}</Link></section></div>
      </div>
    </>}
    {learning && <><div className="dashboard-heading"><h1>{t(learning.title)}</h1><p>{t(learning.description)}</p></div>{section === 'quizzes' ? <QuizLibrary payload={payload} user={user} english={locale === 'en'} /> : librarySection ? <CourseLibrary payload={payload} user={user} view={librarySection} t={t} /> : <section className="dashboard-empty"><OrbitDiagram /><span className="dashboard-badge">{t("À venir")}</span><h2>{t(learning.empty)}</h2><p>{t(learning.detail)}</p><div className="dashboard-actions"><Link className="dashboard-button" href="/dashboard?section=courses">{t("Ouvrir mes cours")}</Link><Link className="dashboard-text-link" href="/dashboard?section=downloads">{t("Explorer les ressources")}</Link></div></section>}</>}
    {section === 'downloads' && <><div className="dashboard-heading"><h1>{t("Téléchargements")}</h1><p>{t("Les ressources SpaceOrbitLAB pour accompagner votre apprentissage.")}</p></div>
      {!downloads ? <section className="dashboard-panel" role="status"><h2>{t("Ressources temporairement indisponibles")}</h2><p>{t("Réessayez dans quelques instants.")}</p><Link className="dashboard-text-link" href="/dashboard?section=downloads">{t("Réessayer")}</Link></section>
        : downloads.resources.length === 0 ? <section className="dashboard-panel"><h2>{t("Les ressources arrivent bientôt")}</h2><p>{t("Les documents publiés seront regroupés dans cet espace.")}</p></section>
        : <div className="dashboard-downloads">{downloads.resources.map((resource) => <article className="dashboard-download" key={resource.id}><span className="dashboard-filetype">{resource.format || t("Fichier")}</span><div><h2>{resource.title}</h2>{resource.description && <p>{resource.description}</p>}</div>{isDownloadUrl(resource.downloadUrl) ? <a className="dashboard-text-link" href={resource.downloadUrl} download>{t("Télécharger")}<span className="dashboard-sr-only"> {resource.title}</span></a> : <span>{t("Fichier indisponible")}</span>}</article>)}</div>}
    </>}
    {section === 'account' && <><div className="dashboard-heading"><h1>{t("Mon compte")}</h1><p>{t("Gérez vos informations personnelles et la sécurité de votre compte.")}</p></div><div className="dashboard-account-grid"><section className="dashboard-panel"><h2>{t("Informations du profil")}</h2><dl className="dashboard-account-details"><dt>{t("Adresse courriel")}</dt><dd>{user.email}</dd></dl><ProfileForm locale={locale} name={user.name ?? ''} /></section><section className="dashboard-panel"><h2>{t("Sécurité")}</h2><p>{t("Pour modifier votre mot de passe, demandez un lien sécurisé envoyé à votre adresse courriel.")}</p><Link className="dashboard-text-link" href="/mot-de-passe-oublie">{t("Modifier mon mot de passe")}</Link></section></div></>}
  </DashboardShell>
}
