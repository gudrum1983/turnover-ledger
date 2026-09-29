export const SUPPORTED_LOCALES = ['ru', 'en', 'srLat', 'srCyr'] as const

export type I18nLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: I18nLocale = 'ru'

export const LOCALE_META: Record<I18nLocale, { label: string; shortLabel: string }> = {
  ru: { label: 'Русский', shortLabel: 'РУС' },
  en: { label: 'English', shortLabel: 'ENG' },
  srLat: { label: 'Srpski', shortLabel: 'SRP' },
  srCyr: { label: 'Српски', shortLabel: 'СРП' },
}

export function isSupportedLocale(value: string): value is I18nLocale {
  return SUPPORTED_LOCALES.includes(value as I18nLocale)
}
