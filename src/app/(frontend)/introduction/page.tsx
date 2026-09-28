import type { Metadata } from 'next'
import { MarketingPage } from '@/components/MarketingPage'

export const metadata: Metadata = {
  title: 'Introduction',
  description: 'Discover the SpaceOrbitLAB astrodynamics program, learning objectives, and practical approach to orbital mechanics.',
}

export default function Introduction() {
  return <MarketingPage slug="introduction" />
}
