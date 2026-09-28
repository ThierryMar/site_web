import type { Metadata } from 'next'
import { MarketingPage } from '@/components/MarketingPage'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Explore four progressive courses in celestial mechanics, astrodynamics, space situational awareness, and remote sensing.',
}

export default function Courses() {
  return <MarketingPage slug="courses" />
}
