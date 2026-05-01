type FormatDateOptions = {
  withTrailingDot?: boolean
}

export function formatDateForUi(value: string, options: FormatDateOptions = {}): string {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  const formatted = `${day}.${month}.${year}`
  return options.withTrailingDot ? `${formatted}.` : formatted
}
