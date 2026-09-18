/** Public resource URLs: accept HTTPS/HTTP or a path on this site, never executable schemes. */
export function isDownloadUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value || value !== value.trim() || /[\\\s]/.test(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}
