import templates from '@/content/legacy-templates.json'

export function SiteHeader({ active, isAuthenticated = false }: { active?: 'home' | 'downloads' | 'introduction' | 'courses' | 'contact'; isAuthenticated?: boolean }) {
  const html = templates.headers[active ?? 'default']
  const header = isAuthenticated
    ? html.replace(/<details class="account-menu">[\s\S]*?<\/details>/, '<a class="account-dashboard" href="/dashboard">Dashboard</a>')
    : html
  // Trusted source-controlled markup, never user-provided HTML.
  return <header className="header" dangerouslySetInnerHTML={{ __html: header }} />
}
