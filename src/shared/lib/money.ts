type FormatMoneyOptions = {
  showMinorZeros?: boolean
}

export function formatMoney(cents: number, options: FormatMoneyOptions = {}): string {
  const { showMinorZeros = false } = options
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const major = Math.floor(abs / 100)
  const minor = abs % 100

  if (minor === 0 && !showMinorZeros) {
    return `${sign}${major}`
  }

  return `${sign}${major},${String(minor).padStart(2, '0')}`
}

export function sumCents(values: Array<number | null | undefined>): number {
  return values.reduce<number>((acc, value) => acc + (value ?? 0), 0)
}
