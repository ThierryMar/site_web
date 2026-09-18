'use client'

import Script from 'next/script'
import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

const key = 'spaceorbitlab.analytics-consent'
const subscribe = (listener: () => void) => {
  window.addEventListener('storage', listener)
  window.addEventListener('analytics-consent', listener)
  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener('analytics-consent', listener)
  }
}
const getSnapshot = () => { try { return localStorage.getItem(key) } catch { return 'denied' } }
const getServerSnapshot = () => 'pending'

export function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const pathname = usePathname()
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (pathname === '/reinitialiser-mot-de-passe') return null
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null

  function choose(value: 'granted' | 'denied') {
    try { localStorage.setItem(key, value) } catch { return }
    // Reload unloads an already loaded GA script when consent is withdrawn.
    window.location.reload()
  }

  return <>
    {consent === 'granted' && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `}</Script>
    </>}
    {consent === null && <aside className="consent" aria-label="Analytics preferences">
      <p>Allow Google Analytics to measure visits and help improve SpaceOrbitLAB? Optional analytics stay off unless you accept.</p>
      <button onClick={() => choose('granted')}>Accept analytics</button>
      <button onClick={() => choose('denied')}>Decline</button>
    </aside>}
    {(consent === 'granted' || consent === 'denied') &&
      <button className="analytics-settings" onClick={() => {
        try { localStorage.removeItem(key) } catch { return }
        window.location.reload()
      }}>Analytics preferences</button>}
  </>
}
