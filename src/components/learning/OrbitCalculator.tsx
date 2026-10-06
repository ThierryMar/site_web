'use client'

import { useState } from 'react'
import { circularOrbit } from '@/lib/orbital-calculations'
import styles from './learning.module.css'

export function OrbitCalculator() {
  const [altitude, setAltitude] = useState(500)
  const orbit = circularOrbit(altitude)
  return <section className={styles.calculator} aria-labelledby="orbit-lab-title">
    <div><h3 id="orbit-lab-title">Try a circular Earth orbit</h3><p>Change the altitude. Observe how the period, speed and energy change together.</p></div>
    <label htmlFor="orbit-altitude">Altitude <output htmlFor="orbit-altitude">{altitude.toLocaleString('en')} km</output></label>
    <input id="orbit-altitude" type="range" min={200} max={40000} step={1} value={altitude} onChange={(event) => setAltitude(Number(event.target.value))} />
    <div className={styles.presets}>{[{ value: 500, label: 'LEO · 500 km' }, { value: 20200, label: 'MEO · 20,200 km' }, { value: 35786, label: 'GEO altitude' }].map(({ value, label }) => <button type="button" key={value} aria-pressed={altitude === value} onClick={() => setAltitude(value)}>{label}</button>)}</div>
    <dl className={styles.measurements} aria-live="polite">
      <div><dt>Orbital period</dt><dd>{(orbit.period / 60).toFixed(1)} <small>min</small></dd></div>
      <div><dt>Circular speed</dt><dd>{orbit.speed.toFixed(3)} <small>km/s</small></dd></div>
      <div><dt>Specific energy</dt><dd>{orbit.energy.toFixed(2)} <small>km²/s²</small></dd></div>
      <div><dt>Specific angular momentum</dt><dd>{Math.round(orbit.momentum).toLocaleString('en')} <small>km²/s</small></dd></div>
    </dl>
    <p className={styles.note}>Ideal two-body model, R⊕ = 6371 km and μ⊕ = 398600.4415 km³/s². Radius = Earth’s radius + altitude. The GEO preset approximates altitude only; a geostationary orbit also requires an equatorial, prograde orbit and a sidereal-day period.</p>
  </section>
}
