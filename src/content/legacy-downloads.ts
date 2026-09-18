// Source: index.html/Download.html, verified against the live site on 2026-09-18.
// This manifest is used only by the import command, never as a public CMS fallback.
export const legacyDownloads = [
  {
    title: 'Astrodynamics acronyms', slug: 'astrodynamics-acronyms', order: 10,
    description: 'A reference list of the acronyms used throughout the SpaceOrbitLAB courses. September 2026 edition.',
    format: 'PDF', directory: 'Fichiers',
    filename: 'SpaceOrbitLAB, Astrodynamics Acronyms_2026-09-01.pdf',
  },
  {
    title: 'SOL Part 0', slug: 'sol-part-0', order: 20,
    description: 'Space Sciences Training: course outline and instructor biography. Version 1.17.',
    format: 'PDF', directory: 'Fichiers',
    filename: 'SOL Part 0 – Space Sciences Training – Courses outline and Instructor bio_v1.17.pdf',
  },
  {
    title: 'SOL Part I.I', slug: 'sol-part-i-i', order: 30,
    description: 'Basic Astronomy & Celestial Mechanics. Course notes, first document, up to section 2.11.',
    format: 'PDF', directory: 'Fichiers',
    filename: 'SOL Part I.I – Basic Astronomy & Celestial mechanics [up to 2.11]_.pdf',
  },
  {
    title: 'SOL Part I.II', slug: 'sol-part-i-ii', order: 40,
    description: 'Basic Astronomy & Celestial Mechanics. Course notes, second document, up to section 2.11.',
    format: 'PDF', directory: 'Fichiers',
    filename: 'SOL Part I.II – Basic Astronomy & Celestial mechanics [up to 2.11]_.pdf',
  },
  {
    title: 'Orbits101', slug: 'orbits101', order: 50,
    description: 'An orbital mechanics simulator developed by Richard L. Lachance. Explore satellite trajectories, modify orbital parameters, and visualize orbits in different reference frames. Beta 0.96 installer.',
    format: 'ZIP', directory: 'Telechargement',
    filename: 'Orbits101 Installer Beta 0.96.zip',
  },
] as const

export const legacyDownloadUrl = (resource: typeof legacyDownloads[number]) =>
  `/legacy/${resource.directory}/${encodeURIComponent(resource.filename)}`

export const downloadsPage = {
  title: 'Downloads',
  slug: 'downloads',
  content: {
    root: {
      type: 'root', version: 1, direction: null, format: '' as const, indent: 0,
      children: [
        'Access course notes, reference documents, and software developed to support your study of orbital mechanics.',
        'Educational videos will be added as they become available.',
      ].map((text) => ({
        type: 'paragraph', version: 1, direction: null, format: '', indent: 0,
        children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }],
      })),
    },
  },
}
