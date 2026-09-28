import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import templates from '@/content/legacy-templates.json'
import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Home() {
  const cookieStore = await cookies()
  let isAuthenticated = false
  if (cookieStore.has(`${(await config).cookiePrefix}-token`)) {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    isAuthenticated = user?.collection === 'users'
  }
  return <><SiteHeader active="home" isAuthenticated={isAuthenticated} /><main dangerouslySetInnerHTML={{ __html: templates.home }} /><SiteFooter /></>
}
