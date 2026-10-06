export type CoeQuestion = { prompt: string; choices?: string[]; multiple?: boolean }
export type CoeSection = { title: string; context?: string; questions: CoeQuestion[] }
const tf = ['True', 'False']
const axes = ['Positive I axis', 'Negative I axis', 'Positive J axis', 'Negative J axis', 'Positive K axis', 'Negative K axis']
const scenarioChoices = ['Satellite is along the I axis (± direction)', 'Satellite is along the J axis (± direction)', 'Satellite is along the K axis (± direction)', 'Satellite is losing potential energy', 'Satellite is gaining potential energy', 'Satellite is over North Pole', 'Satellite is over South Pole', 'Spacecraft is at perigee', 'Spacecraft is at apogee', 'Flight path angle is positive', 'Flight path angle is negative', 'Orbit is retrograde', 'Orbit is prograde', 'Orbit is equatorial', 'Orbit is polar', 'Satellite is at Ascending Node', 'Satellite is at Descending Node', 'Satellite is over Northern Hemisphere', 'Satellite is over Southern Hemisphere']
const scenario = (context: string, vectors?: string[]): CoeSection => ({ title: 'Visualize the following scenario', context, questions: [
  { prompt: 'Which of the following apply to the satellite’s orbit and position? Select all that apply.', choices: scenarioChoices, multiple: true },
  ...(vectors ? [{ prompt: 'What is the position vector for the spacecraft (km)?', choices: vectors }] : []),
] })
export const coeSections: CoeSection[] = [
  { title: 'Quiz — Position and angular momentum', questions: [
    { prompt: 'A satellite with no K component in its position vector, R, must be in an equatorial orbit.', choices: tf },
    { prompt: 'A satellite with no K component in its velocity vector must be equatorial.', choices: tf },
    { prompt: 'In which direction does the specific angular momentum vector, h, point? a = 20,000 km, e = 0.2, i = 0°, ω = 200°, ν = 20°.', choices: axes },
  ] },
  { title: 'Quiz — Reference frame and orbital elements', questions: [
    { prompt: 'In which direction does the specific angular momentum vector, h, point? a = 20,000 km, e = 0.2, i = 90°, Ω = 270°, ω = 270°, ν = 185°.', choices: axes },
    { prompt: 'The Geocentric Equatorial Coordinate Frame, IJK, rotates with the Earth.', choices: tf },
    { prompt: 'The semi-major axis, a, can be determined from only the position vector R.', choices: tf },
    { prompt: 'The ascending node vector, n, will never have a K component.', choices: tf },
  ] },
  { title: 'Quiz — Orbit classification', questions: [
    { prompt: 'An orbit with a = 25,000 km, e = 0.25, i = 110°, Ω = 270°, ω = 225°, ν = 275° is (select all that apply):', choices: ['Polar', 'Prograde', 'Elliptical', 'Retrograde', 'Circular'], multiple: true },
    { prompt: 'Which of the following are true for a satellite in orbit at a true anomaly of 270°? Select all that apply.', choices: ['The flight path angle is positive', 'The satellite is at apogee', 'The satellite is at the semi-latus rectum', 'The satellite is at perigee', 'The flight path angle is negative'], multiple: true },
  ] },
  { title: 'Quiz — Circular polar orbit', questions: [
    { prompt: 'A satellite in orbit with a = 10,000 km, e = 0, and i = 90° requires which remaining orbital elements to fully describe its location? Select all that apply.', choices: ['Argument of latitude', 'True longitude', 'Longitude of perigee', 'True anomaly', 'Right ascension of ascending node', 'Argument of perigee'], multiple: true },
  ] },
  scenario('a = 10,000 km, e = 0.2, i = 30°, Ω = 180°, ω = 90°, ν = 90°'),
  scenario('a = 8,000 km, e = 0.1, i = 90°, Ω = 180°, ω = 90°, ν = 180°', ['−6750 K', '+6750 K', '−8000 K', '+8800 K', '−8800 K', '+8000 K']),
  scenario('a = 10,000 km, e = 0.2, i = 0°, Ω = 90°, ω = 90°, ν = 180°', ['−12000 I', '+12000 I', '−12000 J', '+12000 J', '−12000 K', '+12000 K']),
  { title: 'Quiz — ECI position vector', context: 'a = 8,000 km, e = 0.1, i = 90°, Ω = 145°, ω = 90°, ν = 180°', questions: [{ prompt: 'What is the ECI position vector for the satellite (km)?', choices: ['−6750 K', '+6750 K', '−8000 K', '+8000 K', '−8800 K', '+8800 K'] }] },
  { title: 'Example 1 — Perigee and apogee', context: 'The altitude of a satellite at perigee is 500 km and its orbital eccentricity is 0.1. Find:', questions: ['The satellite’s altitude at apogee', 'The orbit’s specific mechanical energy ε', 'The magnitude of the orbit’s specific angular momentum', 'The satellite’s speed at apogee'].map(prompt => ({ prompt })) },
  { title: 'Example 2 — GEO satellite', context: 'For a GEO satellite, the radial from the center of the Earth to the satellite must have the same angular velocity as the Earth itself, corresponding to the sidereal day (23.9345 hr).', questions: ['Calculate the altitude of a GEO orbit', 'Calculate the specific mechanical energy ε of a GEO satellite’s orbit', 'Calculate the speed of a GEO satellite'].map(prompt => ({ prompt })) },
  { title: 'Example 3 — Jupiter probe', context: 'A Jupiter probe is in a circular orbit around the Earth with a radius of 25,000 km. The next step on the way to Jupiter is to thrust so the probe can enter into an escape orbit.', questions: ['Determine the probe’s velocity in this circular orbit', 'Determine the minimum velocity required to enter a parabolic trajectory at that radius', 'Determine the difference in the specific kinetic, potential, and mechanical energies between the two orbits'].map(prompt => ({ prompt })) },
  { title: 'Quiz — Special orbits', questions: ['What is the inclination of an equatorial orbit?', 'For which orbit is ω undefined?', 'For which orbit is Ω undefined?', 'Which COE is/are varying the fastest?'].map(prompt => ({ prompt })) },
  { title: 'Example (L. George) — State vector', context: 'R = 0 I + 0 J + 10000 K km; V = 6 I + 0 J + 0 K km/s.', questions: ['Where is the satellite currently?', 'What is the orbit’s specific angular momentum?', 'What is the orbit’s semi-major axis?', 'What is the orbit’s eccentricity?', 'What is its inclination?', 'What is its RAAN?', 'What is its argument of perigee?', 'What is the satellite’s true anomaly?'].map(prompt => ({ prompt })) },
  { title: 'Example 2 (L. George) — State vectors', context: 'R = 10000 I + 0 J + 0 K km; V = 0 I + 4.464 J − 4.464 K km/s.', questions: ['Where is the satellite currently?', 'What is the flight path angle at the satellite’s current position?', 'What is the orbit’s specific angular momentum?', 'What are the orbit’s orbital elements?', 'Answer the same four questions for R = 0 I − 7000 J + 0 K km; V = 9 I + 0 J + 0 K km/s.'].map(prompt => ({ prompt })) },
]
