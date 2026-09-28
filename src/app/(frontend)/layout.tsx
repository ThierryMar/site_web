/* eslint-disable @next/next/no-css-tags -- Serve the user's original CSS byte-for-byte, outside the CSS compiler. */
import type { Metadata } from 'next'
import { AnalyticsConsent } from '@/components/AnalyticsConsent'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'SpaceOrbitLAB', template: '%s | SpaceOrbitLAB' },
  description: 'Orbital mechanics, satellite motion, and space mission design.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><link rel="stylesheet" href="/legacy/style.css" /><link rel="stylesheet" href="/legacy-mobile.css" /><link rel="stylesheet" href="/account-menu.css" /></head><body>{children}<AnalyticsConsent /></body></html>
}
