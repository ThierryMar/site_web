export type AccountLocale = 'en' | 'fr'

/** Match supported browser preferences, including region tags and quality weights. */
export function resolveAccountLocale(acceptLanguage: string | null): AccountLocale {
  const preferences = (acceptLanguage ?? '').split(',').map((entry) => {
    const [tag, ...parameters] = entry.trim().toLowerCase().split(';')
    const quality = parameters.find((value) => value.trim().startsWith('q='))
    return { language: tag.split('-')[0], quality: quality ? Number(quality.trim().slice(2)) : 1 }
  }).filter(({ quality }) => Number.isFinite(quality) && quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality)
  return preferences.find(({ language }) => language === 'en' || language === 'fr')?.language as AccountLocale || 'en'
}

import translations from './account-translations.json'
export function accountTranslator(locale: AccountLocale) {
  return (text: string): string => locale === 'fr' ? text : (translations as Record<string, string>)[text] ?? text
}
