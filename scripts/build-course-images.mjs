import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'

const require = createRequire(import.meta.url)
const sharp = createRequire(require.resolve('next/package.json'))('sharp')
const root = 'assets/course-images/astrodynamics-laws'
const inventory = JSON.parse((await fs.readFile(`${root}/extraction.json`, 'utf8')).replace(/^\uFEFF/, ''))
const captions = {
  1: 'Earth and orbital paths: presentation background', 2: 'Earth globe: presentation background', 3: 'Earth globe with geographic coordinates',
  4: 'SpaceOrbitLAB orbital emblem', 5: 'Question illustration from the presentation', 6: 'Hidden-slide marker from the presentation',
  7: 'Earth surrounded by satellite trajectories', 8: 'ABB, collaboration partner named in the presentation', 9: 'SpaceOrbitLAB orbital emblem on a dark background',
  10: 'Original Course II outline', 11: 'Alternate symbols for the solstices and equinoxes', 12: 'Note marker used in the original slides',
  13: 'Space mission architecture emblem', 14: 'Rocket launch trajectory seen from the ground', 15: 'Mark Rober presenting a satellite-building project',
  16: 'Historical astronomical drawing accompanying the introduction to orbital mechanics', 17: 'Tycho Brahe’s Opera Omnia, title page',
  18: 'Tycho Brahe’s astronomical observations, title page', 19: 'A page of Tycho Brahe’s recorded observations',
  20: 'Quotation about the difficulty of observing Mars, attributed to Pliny the Elder', 21: 'Mars declination: Brahe’s observations compared with calculated positions',
  22: 'Astronomical tables and diagrams in Astronomia Nova', 23: 'The title page of Kepler’s Astronomia Nova',
  24: 'Historical plot of the apparent path of Mars', 25: 'A table of observations used to compare orbital models',
  26: 'Quotation about the eight arcminutes that challenged Kepler’s model', 27: 'Heliocentric, Ptolemaic and Tychonic models compared',
  28: 'Geometry of the Earth, Mars and Sun in a heliocentric model', 29: 'Brahe’s observations of Jupiter', 30: 'Brahe’s observations of Venus',
  31: 'Brahe’s observations of Mercury', 32: 'Johannes Kepler and the elliptical-orbit hypothesis',
  33: 'Kepler’s first law: the Sun lies at one focus of the ellipse', 34: 'Equal swept areas at different positions on an elliptical orbit',
  35: 'Equal areas swept near periapsis and apoapsis', 36: 'Animation of equal areas swept during equal time intervals',
  37: 'Names of the nearest and farthest orbital points for different central bodies', 38: 'Perigee and apogee of an Earth-centered ellipse',
  39: 'Derivation of the period law for a circular orbit', 40: 'Planetary orbital periods and semi-major axes on logarithmic axes',
  41: 'Newton’s general form of Kepler’s third law', 42: 'Pages from the Rudolphine Tables',
  43: 'An orbital trajectory and its periapsis reference in three dimensions', 44: 'Geometry of successive node crossings',
  45: 'Original expression for the nodal period with perturbation terms', 46: 'Original explanation of Kepler’s analysis of Brahe’s observations',
  47: 'The same mass has different gravitational weights on Earth, Mars and the Moon', 48: 'Inertia demonstration: a coin drops into a glass when the card is removed',
  49: 'A scene from Gravity used for the spacecraft-force estimate', 50: 'Equal and opposite forces in the Earth–Moon system',
  51: 'Mutual gravitational attraction between two masses', 52: 'Force as the rate of change of momentum',
  53: 'Newton’s third law illustrated by a person and a boat', 54: 'Rocket exhaust and an escaping balloon illustrate action and reaction',
  55: 'The title page of Newton’s Principia Mathematica', 56: 'The gravitational field of a spherical mass distribution',
  57: 'Gravitational field strength inside and outside a uniform solid sphere', 58: 'Cavendish’s torsion-balance experiment',
  59: 'Torsion-balance measurements used to estimate the gravitational constant', 60: 'A laboratory torsion balance',
  61: 'Steve Mould demonstrating the gravitational attraction of metal spheres', 62: 'Sun illustration used in the gravitation diagram',
  63: 'Earth image used in the gravitation diagram', 64: 'Original summary of Newton’s contribution to celestial mechanics',
  65: 'Original summary of Kepler’s three laws', 66: 'A textbook example of kinetic and potential energy on a roller coaster',
  67: 'Animation of the exchange between kinetic and potential energy', 68: 'Derivation of orbital energy in terms of the semi-major axis',
  69: 'The International Space Station in Earth orbit', 70: 'A comparison of velocity changes as orbital eccentricity varies',
  71: 'Original discussion of Kepler’s period law', 72: 'Illustration of the counterintuitive nature of orbital navigation',
  73: 'Position, velocity and angular momentum vectors in an orbital plane', 74: 'A skater changes spin rate by moving their arms',
  75: 'Animated demonstration of angular momentum with a rotating bicycle wheel', 76: 'Flight-path angle and local horizontal geometry',
  77: 'Original example of estimating the Sun’s mass from orbital data', 78: 'Different orbital planes around Earth',
  79: 'An angular momentum vector perpendicular to the orbital plane', 80: 'The Sun–Jupiter barycenter', 81: 'The Earth–Moon barycenter',
  82: 'Original notes on the synodic period', 84: 'Original notes on the nodal period', 88: 'Original notes on inertia and momentum',
  91: 'Original notes on mass, gravity and Newton’s laws', 101: 'Astrodynamics notation from the source slides', 107: 'Greek letters and astronomical symbols',
  110: 'Original notes on G and the gravitational parameter μ', 119: 'Original definition of specific mechanical energy', 127: 'Coordinate and angular notation',
  137: 'Original two-body equation of relative motion', 139: 'Original derivation of relative acceleration', 144: 'Original practice questions on gravity and perigee',
  170: 'Angular momentum conservation, L = m(r × v)', 612: 'Orbital data illustrating Kepler’s third law',
  650: 'Mars semi-major axis from the ratio of orbital periods', 663: 'Mars example: 1 AU × 1.88^(2/3) = 1.523 AU',
  965: 'Original definition of the universal gravitational force', 1196: 'Original notes on energy conservation', 1231: 'Greek alphabet notation',
  1248: 'Original notes on specific angular momentum conservation', 1600: 'Gravitation as the centripetal force in a circular orbit',
  1641: 'Final velocity symbol, vf', 1840: 'Newton’s third law and the action–reaction equation', 1980: 'Gravitational force vector symbol',
  1981: 'Unit-vector definition and Fg = ma', 1991: 'Position vector symbol, R', 2000: 'Radial unit-vector symbol',
  2010: 'Specific angular momentum vector symbol, h', 2011: 'First mass symbol, m₁', 2020: 'Position vector symbol, r',
  2021: 'Second mass symbol, m₂', 2031: 'Velocity vector symbol, v', 2150: 'A constant angular momentum vector fixes the orbital plane',
  2200: 'Velocity-change vector symbol, Δv', 2220: 'Initial velocity symbol, vi', 2350: 'Why the vector equation still represents an inverse-square law',
  2390: 'The barycenter as a mass-weighted position', 6410: 'Comparison of Earth’s and Mars’s period-to-axis ratios',
  7010: 'Equivalent expressions for the Keplerian period', 7710: 'Original spacecraft-force estimate from the film Gravity',
  8210: 'Original statement of Newton’s first law', 8310: 'Original statement and derivation of Newton’s second law',
  10010: 'Original account of Cavendish’s experiment', 10910: 'Specific energy, ε = −μ/(2a)', 11110: 'Original relationship between energy and eccentricity',
  11310: 'The limit of the gravitational potential as distance tends to infinity', 11510: 'Original angular momentum examples', 11610: 'Equivalent angular momentum formulas',
}
const placements = [
  ['An orbit serves a mission', [13,14]], ['Notation and units', [11]], ['A useful distinction', [15,16]],
  ['From observations to laws', [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]],
  ['First law: the shape of the orbit', [33,37,38]], ['Second law: equal areas in equal times', [34,35,36]],
  ['Third law: period and orbital size', [39,40,41]], ['Worked example: weighing the Sun', [42]],
  ['Anomalistic and nodal periods', [43,44]],
  ['Mass, inertia and momentum', [47]], ['First law: uniform motion without a net force', [48]],
  ['Second law: force changes momentum', [52]], ['Third law: forces come in pairs', [50,51,53,54]],
  ['Worked example: pushing a massive spacecraft', [49,55,64,65]],
  ['Why the spherical approximation works', [56,57]], ['G and μ are different quantities', [58,59,60,61]], ['The inverse-square force', [62,63]],
  ['Energy per unit mass', [66,67]], ['Energy and orbital size', [68]], ['Why “slow down to speed up” needs context', [69,70,72]],
  ['The vector perpendicular to the orbit', [73]], ['Conservation under a central force', [74,75]], ['Equivalent formulas', [76]], ['A practical consequence', [78,79]],
  ['The barycenter', [80,81]],
]
// Keep only figures that explain a concept taught in this module. Text captures,
// decorative artwork, isolated symbols and repeated examples stay in the archive.
const selectedFiles = new Set([
  'image14.png', 'image27.png', 'image33.png', 'image36.gif', 'image38.jpg',
  'image40.png', 'image44.png', 'image47.png', 'image48.jpeg', 'image51.png',
  'image54.jpeg', 'image57.png', 'image58.png', 'image67.gif', 'image73.png',
  'image75.gif', 'image76.png', 'image78.png', 'image80.png', 'image81.png',
])
function lessonFor(slide) {
  if (!slide || slide <= 5) return 'overview'
  if (slide <= 18) return 'astrodynamics-mission-and-notation'
  if (slide <= 35) return 'astrodynamics-kepler-laws'
  if (slide <= 41 || slide === 77) return 'astrodynamics-orbital-periods'
  if (slide <= 55 || slide === 62) return 'astrodynamics-newton-laws'
  if (slide <= 61) return 'astrodynamics-gravitation'
  if (slide <= 69) return 'astrodynamics-specific-energy'
  if (slide <= 74) return 'astrodynamics-angular-momentum'
  if (slide <= 80) return 'astrodynamics-relative-motion'
  return 'astrodynamics-practice'
}
await fs.mkdir(`${root}/previews`, { recursive: true })
const images = []
for (const file of inventory.images) {
  if (!selectedFiles.has(file.filename)) continue
  const bytes = await fs.readFile(`${root}/originals/${file.filename}`)
  const extension = path.extname(file.filename).slice(1)
  const id = file.filename.replace('.', '-')
  const needsConversion = ['emf','wdp'].includes(extension)
  const displayFile = needsConversion ? `converted/${file.filename}.png` : `originals/${file.filename}`
  const metadata = await sharp(`${root}/${displayFile}`, { animated: true }).metadata()
  const primary = inventory.occurrences.filter((p) => p.filename === file.filename)
  const references = inventory.references.filter((r) => r.filename === file.filename)
  const slides = [...new Set(references.flatMap((r) => r.owner.match(/^ppt\/slides\/_rels\/slide(\d+)\.xml\.rels$/)?.[1] ?? []).map(Number))].sort((a,b) => a-b)
  const num = Number(file.filename.match(/\d+/)[0])
  let caption = file.filename.startsWith('hdphoto') ? ({ 1: 'Original Earth background before presentation effects', 2: 'Original hidden-slide marker before presentation effects', 3: 'Original cover illustration before presentation effects', 4: 'Original orbital-navigation illustration before presentation effects', 5: 'Original flight-path-angle illustration before presentation effects' })[num] : captions[num]
  if (extension === 'emf') caption = num === 82 ? 'The Earth–Moon orbital geometry, plotted to scale' : 'A close view of Earth and the offset Earth–Moon barycenter'
  if (!caption) throw new Error(`Missing caption: ${file.filename}`)
  let heading = primary.length ? placements.find(([, numbers]) => numbers.includes(num))?.[0] ?? null : null
  if (extension === 'emf') heading = 'The barycenter'
  let lesson = lessonFor(slides[0])
  if (num === 56 && extension === 'jpg') lesson = 'astrodynamics-gravitation'
  const previewFile = extension === 'gif' ? displayFile : `previews/${id}.webp`
  if (extension !== 'gif') await sharp(`${root}/${displayFile}`).resize({ width: 1600, height: 1400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 92 }).toFile(`${root}/${previewFile}`)
  if (extension === 'gif') await sharp(`${root}/${displayFile}`, { animated: false }).webp({ quality: 92 }).toFile(`${root}/previews/${id}-still.webp`)
  images.push({ id, filename: file.filename, caption, alt: caption, lesson, heading, slides,
    kind: heading ? 'illustration' : slides.length ? 'source' : 'artwork',
    width: metadata.width, height: metadata.pageHeight ?? metadata.height, animated: extension === 'gif',
    frames: metadata.pages ?? 1, previewFile, displayFile, stillFile: extension === 'gif' ? `previews/${id}-still.webp` : null,
    sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
  })
}
images.sort((a,b) => (a.slides[0] ?? 0) - (b.slides[0] ?? 0) || a.filename.localeCompare(b.filename, 'en', { numeric: true }))
if (images.length !== selectedFiles.size || images.some((image) => !image.heading)) throw new Error('Every selected illustration must be present and placed in a lesson.')
await fs.writeFile('src/content/astrodynamics-images.json', JSON.stringify({ source: inventory.source, total: images.length, images }, null, 2) + '\n')
await fs.mkdir('public/course-previews/astrodynamics-laws', { recursive: true })
for (const name of ['image33.png','image51.png']) {
  const image = images.find((image) => image.filename === name)
  await fs.copyFile(`${root}/${image.previewFile}`, `public/course-previews/astrodynamics-laws/${image.id}.webp`)
}
console.log(`Prepared ${images.length} images, including ${images.filter((i) => i.animated).length} original animations and ${images.filter((i) => i.heading).length} illustrations placed in lesson sections.`)
