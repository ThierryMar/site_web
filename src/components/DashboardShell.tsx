import Link from 'next/link'
import type { ReactNode } from 'react'
import { logout } from '@/app/(frontend)/auth-actions'

export const dashboardSections = [
  { id: 'overview', label: 'Vue d’ensemble', path: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id: 'courses', label: 'Mes cours', path: 'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1V5' },
  { id: 'lessons', label: 'Mes leçons', path: 'M5 3h14v18H5zM9 8h6M9 12h6M9 16h4' },
  { id: 'progress', label: 'Ma progression', path: 'M4 3v17h17M8 15l4-5 4 2 5-7' },
  { id: 'quizzes', label: 'Mes quiz', path: 'M8 3h8v4H8zM8 5H5v16h14V5h-3M8 14l3 3 5-6' },
  { id: 'downloads', label: 'Téléchargements', path: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5' },
  { id: 'account', label: 'Mon compte', path: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2' },
] as const

export type DashboardSection = typeof dashboardSections[number]['id']

export function DashboardShell({ section, name, email, children }: {
  section: DashboardSection; name: string; email: string; children: ReactNode
}) {
  const current = dashboardSections.find((item) => item.id === section)!
  return <div className="dashboard" lang="fr">
    <a className="dashboard-skip" href="#dashboard-content">Aller au contenu</a>
    <aside className="dashboard-sidebar">
      <Link className="dashboard-brand" href="/" aria-label="SpaceOrbitLAB — accueil">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="5" fill="currentColor" /><ellipse cx="20" cy="20" rx="19" ry="9" transform="rotate(-35 20 20)" stroke="currentColor" strokeWidth="1.5" /></svg>
        SpaceOrbitLAB
      </Link>
      <p className="dashboard-sidebar-caption">Mon espace de formation</p>
      <nav className="dashboard-nav" aria-label="Dashboard">
        {dashboardSections.map((item) => <Link key={item.id} href={item.id === 'overview' ? '/dashboard' : `/dashboard?section=${item.id}`} aria-current={section === item.id ? 'page' : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.path} /></svg>
          {item.label}
        </Link>)}
      </nav>
      <div className="dashboard-sidebar-bottom">
        <Link href="/">Retour au site</Link>
        <div className="dashboard-identity"><span className="dashboard-avatar" aria-hidden="true">{(name || email).slice(0, 1).toUpperCase()}</span><div><strong>{name || 'Mon compte'}</strong><span>{email}</span></div></div>
        <form action={logout}><button className="dashboard-signout">Déconnexion de tous les appareils</button></form>
      </div>
    </aside>
    <div className="dashboard-workspace">
      <header className="dashboard-topbar"><span>Dashboard <span aria-hidden="true">/</span> <strong>{current.label}</strong></span><Link href="/dashboard?section=account">Mon compte</Link></header>
      <main id="dashboard-content" className="dashboard-content" tabIndex={-1}>{children}</main>
      <footer className="dashboard-footer"><span>SpaceOrbitLAB</span><Link href="/contact">Besoin d’aide ?</Link></footer>
    </div>
  </div>
}
