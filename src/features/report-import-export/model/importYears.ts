import type { ReportYearCount } from '@/entities/report'

export type ImportYearItem = {
  year: number
  /** Записей за год сейчас в книге: нужно для итога — год заменится или добавится */
  current: number
  /** Записей за год в файле */
  inFile: number
  /** Сумма записей года в файле, RSD в центах */
  rsdCents: number
}

// Строки списка импорта: только годы из файла, от нового к старому.
// Годы, которых в файле нет, не показываем — импортировать из них нечего.
export function getImportYearItems(currentCounts: ReportYearCount[], fileCounts: ReportYearCount[]): ImportYearItem[] {
  const currentByYear = new Map(currentCounts.map(({ year, count }) => [year, count]))
  return fileCounts
    .map(({ year, count, rsdCents }) => ({ year, current: currentByYear.get(year) ?? 0, inFile: count, rsdCents }))
    .sort((left, right) => right.year - left.year)
}
