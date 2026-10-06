// Provisional teaching key, independently calculated from the supplied PDF.
// Distances: km; time: s. These match the existing teaching calculator.
import { earthMu, earthMeanRadius } from '@/lib/orbital-calculations'

export type CoeCorrection = { answer: string; explanation: string; choices?: number[] }
const entry = (answer: string, explanation: string, choices?: number[]): CoeCorrection => ({ answer, explanation, choices })
const f = (value: number, digits = 3) => value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const rp = earthMeanRadius + 500
const a1 = rp / 0.9
const ra = a1 * 1.1
const geoA = Math.cbrt(earthMu * (23.9345 * 3600 / (2 * Math.PI)) ** 2)
const stateA = 1 / (2 / 10000 - 36 / earthMu)
const stateE = 1 - 360000 / earthMu
const roundedSpeedSquared = 2 * 4.464 ** 2
const roundedA = 1 / (2 / 10000 - roundedSpeedSquared / earthMu)
const roundedE = 1 - roundedSpeedSquared * 10000 / earthMu
const equatorialA = 1 / (2 / 7000 - 81 / earthMu)
const equatorialE = 81 * 7000 / earthMu - 1

export const coeCorrectionConstants = `μ = ${earthMu} km³/s²; Earth radius = ${earthMeanRadius} km. Ideal two-body motion in the geocentric equatorial inertial frame; angles in degrees. Using a different Earth radius changes altitude answers.`
export const coeCorrections: CoeCorrection[][] = [
  [
    entry('False', 'Rₖ = 0 only locates the satellite in the equatorial plane at this instant. An inclined orbit crosses that plane at its nodes.', [1]),
    entry('False', 'Vₖ = 0 only describes the velocity at this instant. On an inclined orbit it can occur at maximum or minimum latitude.', [1]),
    entry('Positive K axis', 'h is normal to the orbital plane. i = 0° gives h = (0, 0, |h|), a prograde equatorial orbit.', [4]),
  ],
  [
    entry('Negative I axis', 'h/|h| = (sin i sin Ω, −sin i cos Ω, cos i). With i = 90° and Ω = 270°, this is (−1, 0, 0).', [1]),
    entry('False', 'The IJK frame here is Earth-centered inertial (ECI). The Earth-fixed frame (ECEF) rotates with Earth.', [1]),
    entry('False', 'Specific energy ε = V²/2 − μ/r, then a = −μ/(2ε). Position alone does not supply the speed or energy.', [1]),
    entry('True', 'n = K × h = (−hⱼ, hᵢ, 0). Its K component is always zero; for an equatorial orbit n is the zero vector and its direction is undefined.', [0]),
  ],
  [
    entry('Elliptical; Retrograde', '0 < e = 0.25 < 1 gives an ellipse; 90° < i = 110° < 180° gives retrograde motion.', [2, 3]),
    entry('At the semi-latus rectum; Flight path angle is negative', 'r = p/(1 + e cos ν); ν = 270° gives r = p. tan γ = e sin ν/(1 + e cos ν) = −e, hence γ < 0 for e > 0. This answer assumes an eccentric elliptic orbit: for e = 0, γ = 0 and ν is undefined.', [2, 4]),
  ],
  [entry('Argument of latitude; Right ascension of ascending node', 'For a circular inclined orbit, Ω specifies the plane and u specifies position measured from the ascending node. There is no unique perigee, so ω and ν are replaced by u = ω + ν.', [0, 4])],
  [entry('Along I; Gaining potential energy; Positive flight path angle; Prograde; Descending Node', 'u = ω + ν = 180° and Ω = 180° give R = +9600 I km. It is exactly on the equator at the descending node, so neither hemisphere applies at that instant. ṙ > 0 at ν = 90°, so −μ/r increases and γ = arctan(0.2) ≈ 11.310°. i = 30° is prograde.', [0, 4, 9, 12, 16])],
  [
    entry('Along K; South Pole; Apogee; Polar; Southern Hemisphere', 'u = 270°, i = 90° give R = −8800 K km. rₐ = a(1 + e). At apogee ṙ = 0 and γ = 0, so neither gaining/losing potential energy nor positive/negative γ applies at that instant. A strictly polar orbit is neither prograde nor retrograde under the i < 90° / i > 90° convention.', [2, 6, 8, 14, 18]),
    entry('−8800 K km', 'rₐ = 8000(1 + 0.1) = 8800 km. The satellite is on the negative K axis.', [4]),
  ],
  [
    entry('Along I; Apogee; Prograde; Equatorial', 'Using the supplied angles as a rotation convention, longitude = Ω + ω + ν = 360° gives R = +12000 I km. At apogee γ = 0 and ṙ = 0. For i = 0°, Ω and the ascending/descending nodes are undefined; the satellite is exactly on the equator, not in either hemisphere.', [0, 8, 12, 13]),
    entry('+12000 I km', 'rₐ = 10000(1 + 0.2) = 12000 km. Although Ω and ω individually are degenerate here, their supplied sum fixes the longitude of perigee and yields the positive I direction.', [1]),
  ],
  [entry('−8800 K km', 'u = 270° and i = 90° put the satellite over the South Pole, independently of Ω. r = 8000(1 + 0.1) = 8800 km.', [4])],
  [
    entry(`${f(ra - earthMeanRadius)} km`, `rₚ = R_E + 500 = ${rp} km; a = rₚ/(1 − e); rₐ = a(1 + e); altitude = rₐ − R_E.`),
    entry(`${f(-earthMu / (2 * a1))} km²/s²`, `a = ${f(a1)} km; ε = −μ/(2a).`),
    entry(`${f(Math.sqrt(earthMu * a1 * 0.99))} km²/s`, 'h = √(μa(1 − e²)). This is specific angular momentum, per unit mass.'),
    entry(`${f(Math.sqrt(earthMu * (2 / ra - 1 / a1)))} km/s`, 'vₐ = √[μ(2/rₐ − 1/a)] = h/rₐ, by vis-viva.'),
  ],
  [
    entry(`${f(geoA - earthMeanRadius)} km`, `T = 23.9345 × 3600 = 86164.2 s; a = [μ(T/2π)²]^(1/3) = ${f(geoA)} km. Altitude = a − R_E. A GEO orbit is circular, equatorial and prograde.`),
    entry(`${f(-earthMu / (2 * geoA))} km²/s²`, 'ε = −μ/(2a).'),
    entry(`${f(Math.sqrt(earthMu / geoA))} km/s`, 'v = √(μ/a) for a circular GEO orbit.'),
  ],
  [
    entry(`${f(Math.sqrt(earthMu / 25000))} km/s`, 'v_c = √(μ/r), with geocentric radius r = 25000 km.'),
    entry(`${f(Math.sqrt(2 * earthMu / 25000))} km/s`, 'v_escape = √(2μ/r) gives a parabolic orbit, ε = 0.'),
    entry(`Δ specific kinetic energy = +${f(earthMu / 50000)} km²/s²; Δ specific potential energy = 0; Δ specific mechanical energy = +${f(earthMu / 50000)} km²/s².`, 'Differences are escape minus circular, evaluated immediately before and after an ideal impulsive burn at the same radius. Potential energy −μ/r is unchanged; the energy increase is entirely kinetic.'),
  ],
  [
    entry('i = 0° (prograde) or i = 180° (retrograde)', 'Both lie in the equatorial plane. If only the usual prograde equatorial case is intended, the expected answer is 0°.'),
    entry('Circular orbits; also undefined as a classical node-referenced angle for equatorial orbits', 'For e = 0 there is no perigee. For i = 0° or 180° there is no ascending-node direction, so classical ω is replaced by an appropriate longitude of perigee when e > 0.'),
    entry('Equatorial orbits (i = 0° or 180°)', 'The node vector is zero; its right ascension Ω is undefined.'),
    entry('True anomaly ν', 'In an ideal two-body orbit, a, e, i, Ω and ω are constant while dν/dt = h/r². For a circular orbit, use argument of latitude or true longitude. With perturbations or thrust the question requires additional context.'),
  ],
  [
    entry('Over the North Pole, at apogee, r = 10000 km', 'R is along +K; R · V = 0. The supplied speed 6 km/s is below the circular speed at this radius, identifying apogee.'),
    entry('h = +60000 J km²/s; |h| = 60000 km²/s', 'h = R × V = (0, 60000, 0).'),
    entry(`${f(stateA)} km`, 'ε = 6²/2 − μ/10000; a = −μ/(2ε).'),
    entry(`e = ${f(stateE, 6)}`, 'e⃗ = (V × h)/μ − R/r = −e K. The eccentricity magnitude is 1 − 360000/μ.'),
    entry('i = 90°', 'hₖ = 0, so i = arccos(hₖ/|h|) = 90°.'),
    entry('Ω = 180°', 'n = K × h = −60000 I; the ascending node lies along −I.'),
    entry('ω = 270°', 'From n = −I to e⃗ = −K, measured in the direction of motion about h = +J, the angle is 270°.'),
    entry('ν = 180°', 'R points opposite to the eccentricity vector: the satellite is at apogee.'),
  ],
  [
    entry('On the equator along +I, at the descending node', 'Vₖ < 0 means southward crossing. With the stated rounded speed treated exactly, it is also at apogee of a nearly circular orbit.'),
    entry('γ = 0°', 'R · V = 0, so radial velocity and flight path angle are zero.'),
    entry(`h = 44640 J + 44640 K km²/s; |h| = ${f(10000 * Math.sqrt(roundedSpeedSquared))} km²/s`, 'Cross product of the supplied R and V.'),
    entry(`Using the stated velocities exactly: a = ${f(roundedA)} km, e = ${f(roundedE, 7)}, i = 45°, Ω = 180°, ω = 0°, ν = 180°.`, 'Rounding matters: 4.464 km/s produces a very small nonzero eccentricity. If the intended orbit is exactly circular, use a = 10000 km, e = 0, i = 45°, Ω = 180°, u = 180°; ω and ν are then undefined. Accept this intended circular interpretation provisionally.'),
    entry(`Position: equator along −J, at perigee. γ = 0°. h = +63000 K km²/s. a = ${f(equatorialA)} km, e = ${f(equatorialE, 6)}, i = 0°, ν = 0°. Ω and ω are undefined; longitude of perigee ϖ = 270° (true longitude also 270°).`, 'R · V = 0; the speed is above circular and below escape speed, so this is elliptic perigee. h points along +K. The eccentricity vector points along −J. For this equatorial orbit use longitude of perigee instead of Ω and ω.'),
  ],
]
