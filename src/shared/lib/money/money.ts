type FormatMoneyOptions = {
  locale?: 'sr' | 'en' | 'ru'
  showMinorZeros?: boolean
}

export function formatMoney(cents: number, options: FormatMoneyOptions = {}): string {
  const { showMinorZeros = false, locale = 'ru' } = options
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const major = Math.floor(abs / 100)
  const minor = abs % 100
  const { groupSeparator, decimalSeparator } = getSeparators(locale)
  const majorFormatted = major.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)

  if (minor === 0 && !showMinorZeros) {
    return `${sign}${majorFormatted}`
  }

  return `${sign}${majorFormatted}${decimalSeparator}${String(minor).padStart(2, '0')}`
}

export function sumCents(values: Array<number | null | undefined>): number {
  return values.reduce<number>((acc, value) => acc + (value ?? 0), 0)
}

function getSeparators(locale: 'sr' | 'en' | 'ru') {
  if (locale === 'sr') {
    return { groupSeparator: '.', decimalSeparator: ',' }
  }
  if (locale === 'en') {
    return { groupSeparator: ',', decimalSeparator: '.' }
  }
  return { groupSeparator: ' ', decimalSeparator: ',' }
}
