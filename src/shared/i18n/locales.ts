export const SUPPORTED_LOCALES = ['ru', 'en', 'srLat', 'srCyr'] as const

export type I18nLocale = (typeof SUPPORTED_LOCALES)[number]
export type I18nLocaleLabelKey = `ui.locale.${I18nLocale}`

export const DEFAULT_LOCALE: I18nLocale = 'ru'

export const LOCALE_LABEL_KEY_BY_LOCALE: Record<I18nLocale, I18nLocaleLabelKey> = {
  ru: 'ui.locale.ru',
  en: 'ui.locale.en',
  srLat: 'ui.locale.srLat',
  srCyr: 'ui.locale.srCyr',
}

export function isSupportedLocale(value: string): value is I18nLocale {
  return SUPPORTED_LOCALES.includes(value as I18nLocale)
}
