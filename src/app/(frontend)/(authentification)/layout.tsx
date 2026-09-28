import Link from 'next/link'

export default function AuthentificationLayout({ children }: { children: React.ReactNode }) {
  return <main className="auth-page" lang="fr">
    <Link className="brand" href="/">SpaceOrbitLAB</Link>
    <div className="account-navigation">
      <Link href="/">Home</Link>
      <details className="account-menu">
        <summary>Account <span aria-hidden="true">▾</span></summary>
        <div className="account-menu-links">
          <Link href="/connexion">Sign in</Link>
          <Link href="/inscription">Create an account</Link>
          <Link href="/mon-compte">My account &amp; settings</Link>
        </div>
      </details>
    </div>
    <section className="auth-card">
      <p className="auth-eyebrow">VOTRE ESPACE D’EXPLORATION</p>
      {children}
    </section>
    <footer>SpaceOrbitLAB · Formation en sciences spatiales</footer>
  </main>
}
