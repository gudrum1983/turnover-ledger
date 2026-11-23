import { FOOTER_FIELDS, HEADER_FIELDS, type FooterField, type HeaderField } from './fields'
import { getRowTotals, type MoneyPart, type ReportRow } from '@/entities/report-row/@x/report'
import { sumCents } from '@/shared/lib/money/money'
import { REPORT_FIRST_YEAR } from '@/shared/constants/app'
import { REPORT_EXPORT_VERSION, type ReportExportFile, type ReportMeta, type ReportState } from './types'

export type ReportTableTotals = {
  foreignCents: number
  rsdCents: number
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringRecord = <T extends string>(value: unknown, fields: readonly T[]): value is Record<T, string> => {
  if (!isObject(value)) return false

  return fields.every((field) => typeof value[field] === 'string')
}

const isMoneyPart = (value: unknown): value is MoneyPart => {
  if (!isObject(value)) return false
  if (typeof value.rsdCents !== 'number' || !Number.isFinite(value.rsdCents)) return false

  const foreignCents = value.foreignCents
  return foreignCents === undefined || foreignCents === null || typeof foreignCents === 'number'
}

const isReportRow = (value: unknown): value is ReportRow => {
  if (!isObject(value)) return false
  if (typeof value.id !== 'string') return false
  if (typeof value.date !== 'string') return false
  if (typeof value.description !== 'string') return false
  if (typeof value.currency !== 'string') return false

  const exchangeRate = value.exchangeRate
  if (exchangeRate !== undefined && exchangeRate !== null && typeof exchangeRate !== 'number') return false

  if (!isObject(value.amounts)) return false

  return isMoneyPart(value.amounts.goods) && isMoneyPart(value.amounts.services)
}

export const getTableTotals = (rows: ReportRow[]): ReportTableTotals => {
  return rows.reduce<ReportTableTotals>(
    (acc, row) => {
      const totals = getRowTotals(row)
      acc.foreignCents = sumCents([acc.foreignCents, totals.foreignCents])
      acc.rsdCents = sumCents([acc.rsdCents, totals.rsdCents])
      return acc
    },
    { foreignCents: 0, rsdCents: 0 },
  )
}

export function isReportState(value: unknown): value is ReportState {
  if (!isObject(value)) return false
  if (!isObject(value.meta)) return false
  if (!isStringRecord<HeaderField>(value.meta.header, HEADER_FIELDS)) return false
  if (!isStringRecord<FooterField>(value.meta.footer, FOOTER_FIELDS)) return false
  if (!Array.isArray(value.rows)) return false

  return value.rows.every(isReportRow)
}

export function cloneReportState(state: ReportState): ReportState {
  return {
    meta: {
      header: { ...state.meta.header },
      footer: { ...state.meta.footer },
    },
    rows: state.rows.map((row) => ({
      ...row,
      amounts: {
        goods: { ...row.amounts.goods },
        services: { ...row.amounts.services },
      },
    })),
  }
}

export function createReportExportFile(state: ReportState): ReportExportFile {
  return {
    version: REPORT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: cloneReportState(state),
  }
}

export function isReportExportFile(value: unknown): value is ReportExportFile {
  if (!isObject(value)) return false
  if (value.version !== REPORT_EXPORT_VERSION) return false
  if (typeof value.exportedAt !== 'string') return false

  return isReportState(value.data)
}

export function parseImportedReportState(value: unknown): ReportState | null {
  if (isReportState(value)) {
    return cloneReportState(value)
  }

  if (isReportExportFile(value)) {
    return cloneReportState(value.data)
  }

  return null
}

// Год записи по дате YYYY-MM-DD. Без корректной даты записи не относятся ни к одному году.
export function getRowYear(row: ReportRow): number | null {
  return /^\d{4}-\d{2}-\d{2}$/.test(row.date) ? Number(row.date.slice(0, 4)) : null
}

// Дата в формате YYYY-MM-DD по местному времени — так же хранятся даты записей.
const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Дату записи можно ввести в таблицу: настоящая дата не раньше 1 января REPORT_FIRST_YEAR и не позже сегодня.
// Те же границы, что у поля даты в форме записи.
export function isRowDateAllowed(row: ReportRow, today: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return false
  const [year, month, day] = row.date.split('-').map(Number) as [number, number, number]
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false
  return row.date >= `${REPORT_FIRST_YEAR}-01-01` && row.date <= toIsoDate(today)
}

// Данные из файла для импорта: только записи с допустимой датой, и сколько записей отброшено.
export function filterImportableRows(state: ReportState, today: Date = new Date()) {
  const rows = state.rows.filter((row) => isRowDateAllowed(row, today))
  return {
    state: { meta: state.meta, rows },
    skippedCount: state.rows.length - rows.length,
  }
}

export type ReportYearCount = {
  year: number
  count: number
}

// Годы, в которых есть записи, с числом записей — от нового к старому.
export function getReportYearCounts(rows: ReportRow[]): ReportYearCount[] {
  const counts = new Map<number, number>()
  for (const row of rows) {
    const year = getRowYear(row)
    if (year !== null) counts.set(year, (counts.get(year) ?? 0) + 1)
  }
  return [...counts].map(([year, count]) => ({ year, count })).sort((left, right) => right.year - left.year)
}

export function createEmptyReportMeta(): ReportMeta {
  return {
    header: Object.fromEntries(HEADER_FIELDS.map((field) => [field, ''])) as Record<HeaderField, string>,
    footer: Object.fromEntries(FOOTER_FIELDS.map((field) => [field, ''])) as Record<FooterField, string>,
  }
}

// Заполнено ли хоть одно поле реквизитов.
export function hasReportMeta(meta: ReportMeta): boolean {
  return [...Object.values(meta.header), ...Object.values(meta.footer)].some((value) => value.trim().length > 0)
}

/**
 * Что взять при экспорте.
 * years: 'all' — все записи целиком (вместе с записями без корректной даты), массив — только записи этих годов.
 * meta — реквизиты (шапка и подписи).
 */
export type ReportStateSelection = {
  years: number[] | 'all'
  meta: boolean
}

const pickRows = (rows: ReportRow[], years: number[]) => {
  const yearSet = new Set(years)
  return rows.filter((row) => {
    const year = getRowYear(row)
    return year !== null && yearSet.has(year)
  })
}

// Данные для файла экспорта: выбранные годы; без реквизитов — с пустыми полями (формат файла их требует).
export function pickReportState(state: ReportState, selection: ReportStateSelection): ReportState {
  return cloneReportState({
    meta: selection.meta ? state.meta : createEmptyReportMeta(),
    rows: selection.years === 'all' ? state.rows : pickRows(state.rows, selection.years),
  })
}

export type ReportImportSelection = {
  /** Годы, которые берутся из файла */
  years: number[]
  /** Брать ли реквизиты из файла */
  meta: boolean
}

// Результат импорта: записи выбранных годов заменяются записями этих годов из файла,
// остальные годы (и записи без корректной даты) не меняются. Реквизиты берутся из файла, только если выбраны.
export function mergeReportState(
  current: ReportState,
  incoming: ReportState,
  selection: ReportImportSelection,
): ReportState {
  const yearSet = new Set(selection.years)
  return cloneReportState({
    meta: selection.meta ? incoming.meta : current.meta,
    rows: [
      ...current.rows.filter((row) => {
        const year = getRowYear(row)
        return year === null || !yearSet.has(year)
      }),
      ...pickRows(incoming.rows, selection.years),
    ],
  })
}
