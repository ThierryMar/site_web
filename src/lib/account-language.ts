import 'server-only'
import { headers } from 'next/headers'
import { accountTranslator, resolveAccountLocale } from './account-locale'

export async function getAccountLanguage() {
  const locale = resolveAccountLocale((await headers()).get('accept-language'))
  return { locale, t: accountTranslator(locale) }
}
