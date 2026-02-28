type FormatDateOptions = {
  withTrailingDot?: boolean
}

export function formatDateForUi(value: string, options: FormatDateOptions = {}): string {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  const formatted = `${day}.${month}.${year}`
  //todo: ставить ли точки в конце дат если в описании между датой и текстом есть запятая
  return options.withTrailingDot ? `${formatted}.` : formatted
}
