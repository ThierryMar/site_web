import Link from 'next/link'

export default function AuthentificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page" lang="fr">
      <Link className="brand" href="/">SpaceOrbitLAB</Link>
      <section className="auth-card">
        <p className="auth-eyebrow">VOTRE ESPACE D’EXPLORATION</p>
        {children}
      </section>
      <footer>SpaceOrbitLAB · Formation en sciences spatiales</footer>
    </main>
  )
}
