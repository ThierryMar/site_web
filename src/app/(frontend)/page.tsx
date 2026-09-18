import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Link className="brand" href="/">SpaceOrbitLAB</Link>
      <nav className="home-auth" aria-label="Compte"><Link href="/connexion">Se connecter</Link><Link href="/inscription">Créer un compte</Link><Link href="/mon-compte">Mon compte</Link></nav>
      <div className="orbit" aria-hidden="true"><span /></div>
      <p className="eyebrow">Theory · Simulation · Operation</p>
      <h1>Understand motion.<br />Explore space.</h1>
      <p className="intro">A progressive introduction to orbital mechanics, satellite motion, and space mission design.</p>
      <p className="notice">Our learning platform is being prepared. Course access will be available here.</p>
      <footer>SpaceOrbitLAB · Space sciences training</footer>
    </main>
  )
}
