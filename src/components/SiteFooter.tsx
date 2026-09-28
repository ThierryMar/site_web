import Link from 'next/link'

export function SiteFooter() {
  return <footer className="footer"><div className="container contenu-footer">
    <p>SpaceOrbitLAB · Space sciences training</p><p>© 2026 — All Rights Reserved</p>
    <Link href="/connexion">Sign in</Link><Link href="/mon-compte">My account</Link>
  </div></footer>
}
