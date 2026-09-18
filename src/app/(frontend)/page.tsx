import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'

export default function Home() {
  return (
    <main>
      <SiteHeader active="home" />
      <nav className="home-auth" aria-label="Registration"><Link href="/inscription">Create an account</Link></nav>
      <div className="orbit" aria-hidden="true"><span /></div>
      <p className="eyebrow">Theory · Simulation · Operation</p>
      <h1>Understand motion.<br />Explore space.</h1>
      <p className="intro">A progressive introduction to orbital mechanics, satellite motion, and space mission design.</p>
      <p className="notice">Our learning platform is being prepared. Course access will be available here.</p>
      <footer>SpaceOrbitLAB · Space sciences training</footer>
    </main>
  )
}
