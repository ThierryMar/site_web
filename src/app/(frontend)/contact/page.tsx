import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import templates from '@/content/legacy-templates.json'

export const metadata: Metadata = { title: 'Contact Us', description: 'Meet Richard L. Lachance and discover his work in space sciences and orbital mechanics.' }

export default function Contact() {
  return <><SiteHeader active="contact" /><main dangerouslySetInnerHTML={{ __html: templates.contact }} /><SiteFooter /></>
}
