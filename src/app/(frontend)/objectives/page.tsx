import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import templates from '@/content/legacy-templates.json'

export default function Objectives() {
  return <><SiteHeader /><main lang="fr" dangerouslySetInnerHTML={{ __html: templates.objectives }} /><SiteFooter /></>
}
