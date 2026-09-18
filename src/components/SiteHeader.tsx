import Link from 'next/link'

export function SiteHeader({ active }: { active?: 'home' | 'downloads' }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">SpaceOrbitLAB</Link>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" aria-current={active === 'home' ? 'page' : undefined}>Home</Link>
        <Link href="/downloads" aria-current={active === 'downloads' ? 'page' : undefined}>Downloads</Link>
        <Link href="/connexion">Sign in</Link>
        <Link href="/mon-compte">My account</Link>
      </nav>
    </header>
  )
}
