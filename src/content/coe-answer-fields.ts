export type CoeAnswerField = { id: string; label: string; unit?: string; options?: string[] }
const numeric = (id: string, label: string, unit?: string): CoeAnswerField => ({ id, label, unit })
const select = (id: string, label: string, options: string[]): CoeAnswerField => ({ id, label, options })
const a = numeric('a', 'Semi-major axis a', 'km')
const e = numeric('e', 'Eccentricity e')
const i = numeric('i', 'Inclination i', '°')
const raan = numeric('raan', 'RAAN Ω', '°')
const omega = numeric('omega', 'Argument of perigee ω', '°')
const nu = numeric('nu', 'True anomaly ν', '°')
const momentum = [numeric('hi', 'h — I component', 'km²/s'), numeric('hj', 'h — J component', 'km²/s'), numeric('hk', 'h — K component', 'km²/s')]
const undefinedOptions = ['Defined', 'Undefined']

export const coeAnswerFields: Record<string, CoeAnswerField[]> = {
  '8-0': [numeric('value', 'Apogee altitude', 'km')],
  '8-1': [numeric('value', 'Specific mechanical energy ε', 'km²/s²')],
  '8-2': [numeric('value', 'Specific angular momentum magnitude', 'km²/s')],
  '8-3': [numeric('value', 'Speed at apogee', 'km/s')],
  '9-0': [numeric('value', 'GEO altitude', 'km')],
  '9-1': [numeric('value', 'Specific mechanical energy ε', 'km²/s²')],
  '9-2': [numeric('value', 'GEO speed', 'km/s')],
  '10-0': [numeric('value', 'Circular speed', 'km/s')],
  '10-1': [numeric('value', 'Minimum escape speed', 'km/s')],
  '10-2': [numeric('kinetic', 'Change in specific kinetic energy', 'km²/s²'), numeric('potential', 'Change in specific potential energy', 'km²/s²'), numeric('mechanical', 'Change in specific mechanical energy', 'km²/s²')],
  '11-0': [i],
  '11-1': [select('orbit', 'Orbit for which ω is undefined', ['Circular', 'Equatorial', 'Circular or equatorial', 'Polar only', 'Any elliptical orbit'])],
  '11-2': [select('orbit', 'Orbit for which Ω is undefined', ['Equatorial', 'Polar', 'Any circular orbit', 'Any elliptical orbit'])],
  '11-3': [select('element', 'Fastest-varying COE (ideal two-body orbit)', ['True anomaly ν', 'Semi-major axis a', 'Eccentricity e', 'Inclination i', 'RAAN Ω', 'Argument of perigee ω'])],
  '12-0': [select('location', 'Current location', ['North Pole', 'South Pole', 'Equator']), select('apsis', 'Current orbital position', ['Apogee', 'Perigee', 'Neither apsis'])],
  '12-1': momentum,
  '12-2': [a], '12-3': [e], '12-4': [i], '12-5': [raan], '12-6': [omega], '12-7': [nu],
  '13-0': [select('location', 'Current location', ['Equator along +I', 'Equator along −I', 'North Pole', 'South Pole']), select('node', 'Current node', ['Descending node', 'Ascending node', 'Neither node'])],
  '13-1': [numeric('gamma', 'Flight path angle γ', '°')],
  '13-2': momentum,
  '13-3': [a, e, i, raan, select('omega', 'Argument of perigee ω', ['0°', '90°', '180°', '270°', 'Undefined (circular interpretation)']), select('nu', 'True anomaly ν', ['0°', '90°', '180°', '270°', 'Undefined (circular interpretation)'])],
  '13-4': [select('location', 'Current location', ['Equator along −J', 'Equator along +J', 'North Pole', 'South Pole']), select('apsis', 'Current orbital position', ['Perigee', 'Apogee', 'Neither apsis']), numeric('gamma', 'Flight path angle γ', '°'), ...momentum, a, e, i,
    select('raanStatus', 'RAAN Ω', undefinedOptions), select('omegaStatus', 'Argument of perigee ω', undefinedOptions), nu, numeric('longitude', 'Longitude of perigee ϖ', '°')],
}
