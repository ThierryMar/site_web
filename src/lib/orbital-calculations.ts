// Rounded teaching constants: distances in km, time in seconds.
export const earthMu = 398600.4415
export const earthMeanRadius = 6371

export function circularOrbit(altitudeKm: number) {
  if (!Number.isFinite(altitudeKm) || altitudeKm < 200 || altitudeKm > 40000) throw new RangeError('Altitude must be between 200 and 40000 km.')
  const radius = earthMeanRadius + altitudeKm
  const speed = Math.sqrt(earthMu / radius)
  return { radius, speed, period: 2 * Math.PI * Math.sqrt(radius ** 3 / earthMu),
    energy: -earthMu / (2 * radius), momentum: radius * speed, acceleration: earthMu / radius ** 2 }
}
