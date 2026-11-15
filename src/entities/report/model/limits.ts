import { getRowTotals, type ReportRow } from '@/entities/report-row/@x/report'
import { sumCents } from '@/shared/lib/money/money'

/** Годовой лимит паушала: доход за календарный год — 6 000 000 RSD. */
export const PAUSAL_ANNUAL_LIMIT_RSD_CENTS = 6_000_000 * 100

/** Скользящий лимит НДС (PDV): доход за любые 12 месяцев подряд — 8 000 000 RSD. */
export const PDV_ROLLING_LIMIT_RSD_CENTS = 8_000_000 * 100

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export type RollingLimitExceedance = {
  /** Первая дата года, на которую доход за последние 12 месяцев превысил лимит */
  date: string
  /** Доход за 12 месяцев, заканчивающихся этой датой */
  totalRsdCents: number
}

export type YearLimitStatus = {
  /** Доход за календарный год */
  annualTotalRsdCents: number
  isPausalLimitExceeded: boolean
  /** null — скользящий лимит в этом году не превышен */
  pdvLimitExceedance: RollingLimitExceedance | null
}

/** Дата, которая отстоит от `date` ровно на год назад (YYYY-MM-DD). Для 29.02 даёт «29.02» прошлого года:
 * при строковом сравнении она корректно ложится между 28.02 и 01.03. */
const shiftYearBack = (date: string) => `${String(Number(date.slice(0, 4)) - 1).padStart(4, '0')}${date.slice(4)}`

/**
 * Ищет первую дату в году `year`, на которую сумма доходов за 12 месяцев (с этой датой включительно)
 * превысила лимит. Окно для даты D — (D − 1 год; D], т. е. для 15.03.2025 это 16.03.2024–15.03.2025.
 * В окно попадают записи всех лет, поэтому доходы прошлого года учитываются в начале текущего.
 */
export function findRollingLimitExceedance(
  rows: ReportRow[],
  year: number,
  limitRsdCents: number = PDV_ROLLING_LIMIT_RSD_CENTS,
): RollingLimitExceedance | null {
  const yearPrefix = `${String(year).padStart(4, '0')}-`
  const dated = rows
    .filter((row) => DATE_PATTERN.test(row.date))
    .map((row) => ({ date: row.date, rsdCents: getRowTotals(row).rsdCents }))
    .sort((left, right) => left.date.localeCompare(right.date))

  // Скользящее окно двумя указателями: [start; end] — записи, попадающие в 12 месяцев до dated[end].date.
  let start = 0
  let windowCents = 0

  for (let end = 0; end < dated.length; end += 1) {
    const current = dated[end]!
    windowCents += current.rsdCents

    const windowStartExclusive = shiftYearBack(current.date)
    while (dated[start]!.date <= windowStartExclusive) {
      windowCents -= dated[start]!.rsdCents
      start += 1
    }

    // Записи с одной датой учитываем все вместе — проверяем на последней из них.
    if (dated[end + 1]?.date === current.date) continue
    if (!current.date.startsWith(yearPrefix)) continue

    if (windowCents > limitRsdCents) {
      return { date: current.date, totalRsdCents: windowCents }
    }
  }

  return null
}

/** Состояние лимитов для года: годовой лимит паушала и скользящий лимит PDV. */
export function getYearLimitStatus(rows: ReportRow[], year: number): YearLimitStatus {
  const yearPrefix = `${String(year).padStart(4, '0')}-`
  const annualTotalRsdCents = sumCents(
    rows
      .filter((row) => DATE_PATTERN.test(row.date) && row.date.startsWith(yearPrefix))
      .map((row) => getRowTotals(row).rsdCents),
  )

  return {
    annualTotalRsdCents,
    isPausalLimitExceeded: annualTotalRsdCents > PAUSAL_ANNUAL_LIMIT_RSD_CENTS,
    pdvLimitExceedance: findRollingLimitExceedance(rows, year),
  }
}
