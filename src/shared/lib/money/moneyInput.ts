// Строка суммы в поле ввода. Пока поле в фокусе, в нём только цифры и разделитель дробной части локали
// («1200,5»), после ухода из поля — с разрядами и двумя знаками («1 200,50», «1,200.50», «1.200,50»).

const numberParts = (locale: Intl.LocalesArgument) => new Intl.NumberFormat(locale).formatToParts(1000.1)

/** Разделитель дробной части: «,» для ru-RU и sr-RS, «.» для en-US */
export function getDecimalSeparator(locale: Intl.LocalesArgument): string {
  return numberParts(locale).find((part) => part.type === 'decimal')?.value ?? ','
}

/** Разделитель разрядов: неразрывный пробел для ru-RU, «,» для en-US, «.» для sr-RS */
export function getGroupSeparator(locale: Intl.LocalesArgument): string {
  return numberParts(locale).find((part) => part.type === 'group')?.value ?? ' '
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Убирает разряды и приводит разделитель дробной части к локали: «1.200,50» → «1200,50» (sr-RS).
 *
 * Разряды-пробелы убираются всегда. Разряды-точки и запятые — только если строка точно в нашем формате
 * после ухода из поля (группы по 3 цифры и два знака после разделителя): при наборе «.» и «,» — это
 * разделитель дробной части, ведь на телефоне клавиатура показывает разделитель системной локали.
 */
export function normalizeMoneyInput(value: string, locale: Intl.LocalesArgument): string {
  const decimal = getDecimalSeparator(locale)
  const group = getGroupSeparator(locale)
  let result = value.replace(/\s/g, '')

  if (group.trim() !== '') {
    const formatted = new RegExp(`^\\d{1,3}(?:${escapeRegExp(group)}\\d{3})+${escapeRegExp(decimal)}\\d{2}$`)
    if (formatted.test(result)) result = result.split(group).join('')
  }

  return result.replace(/[.,]/g, decimal)
}

/** Число из строки поля суммы. Пустое или некорректное значение — 0 */
export function parseMoneyInput(value: string | null | undefined, locale: Intl.LocalesArgument): number {
  if (!value) return 0

  const normalized = normalizeMoneyInput(value, locale).replace(getDecimalSeparator(locale), '.')
  const result = Number(normalized)

  return Number.isFinite(result) ? result : 0
}

/** Сумма для поля после ухода из него: два знака после разделителя и разряды — «1 200,50» */
export function formatMoneyInput(value: number, locale: Intl.LocalesArgument): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

/**
 * Добавляет разряды к строке без них, не трогая дробную часть: «1200,5» → «1 200,5».
 * Для маски поля: значение после неё всегда из цифр и одного разделителя дробной части.
 */
export function groupMoneyInput(value: string, locale: Intl.LocalesArgument): string {
  const decimal = getDecimalSeparator(locale)
  const [integer = '', ...fraction] = value.split(decimal)
  if (!/^\d+$/.test(integer)) return value

  const grouped = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(BigInt(integer))
  return fraction.length > 0 ? `${grouped}${decimal}${fraction.join('')}` : grouped
}
