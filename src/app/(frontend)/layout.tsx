import type { Metadata } from 'next'
import { AnalyticsConsent } from '@/components/AnalyticsConsent'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'SpaceOrbitLAB', template: '%s | SpaceOrbitLAB' },
  description: 'Orbital mechanics, satellite motion, and space mission design.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<AnalyticsConsent /></body></html>
}
