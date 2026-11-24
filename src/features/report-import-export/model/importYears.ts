import type { ReportYearCount } from '@/entities/report'

export type ImportYearItem = {
  year: number
  /** Записей за год сейчас */
  current: number
  /** Записей за год в файле */
  inFile: number
}

// Строки списка импорта: все годы из текущих данных и из файла, от нового к старому.
// Год, которого нет в файле, импортировать нечего — его показываем, чтобы было видно, что он не изменится.
export function getImportYearItems(currentCounts: ReportYearCount[], fileCounts: ReportYearCount[]): ImportYearItem[] {
  const items = new Map<number, ImportYearItem>()
  for (const { year, count } of currentCounts) items.set(year, { year, current: count, inFile: 0 })
  for (const { year, count } of fileCounts) {
    items.set(year, { year, current: items.get(year)?.current ?? 0, inFile: count })
  }
  return [...items.values()].sort((left, right) => right.year - left.year)
}
