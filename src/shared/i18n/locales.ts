export const SUPPORTED_LOCALES = ['ru', 'en', 'srLat', 'srCyr'] as const

export type I18nLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: I18nLocale = 'ru'

export const LOCALE_LABEL_BY_LOCALE: Record<I18nLocale, string> = {
  ru: 'Русский',
  en: 'English',
  srLat: 'Srpski',
  srCyr: 'Српски',
}

export function isSupportedLocale(value: string): value is I18nLocale {
  return SUPPORTED_LOCALES.includes(value as I18nLocale)
}
