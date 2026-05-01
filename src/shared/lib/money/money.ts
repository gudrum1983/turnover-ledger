import type { I18nLocale } from '../../i18n/locales.ts'

type FormatMoneyOptions = {
  locale?: 'ru' | 'en' | 'srLat' | 'srCyr'
  showMinorZeros?: boolean
}

export function formatMoney(cents: number, options: FormatMoneyOptions = {}): string {
  const { showMinorZeros = true, locale = 'ru' } = options
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  return sign + formatMoneyForUi(abs, locale, showMinorZeros)
}

export function formatMoneySafe(cents?: number | null, options: FormatMoneyOptions = {}): string {
  return formatMoney(cents ?? 0, options)
}

export function sumCents(values: Array<number | null | undefined>): number {
  return values.reduce<number>((acc, value) => acc + (value ?? 0), 0)
}

function intlFormat(value: number, locales: string, showMinorZeros: boolean): string {
  if (showMinorZeros) return new Intl.NumberFormat(locales, { minimumFractionDigits: 2 }).format(value / 100)

  return new Intl.NumberFormat(locales).format(value)
}

export function formatMoneyForUi(cents: number, locales: I18nLocale, showMinorZeros: boolean): string {
  if (locales === 'en') {
    return intlFormat(cents, 'en-US', showMinorZeros)
  }

  if (locales === 'srCyr' || locales === 'srLat') {
    return intlFormat(cents, 'sr-RS', showMinorZeros)
  }

  return intlFormat(cents, 'ru-RU', showMinorZeros)
}
