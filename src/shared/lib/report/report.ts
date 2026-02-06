import type { ReportRow } from '../../types/report'
import { sumCents } from '../money/money'

export type ReportRowTotals = {
  foreignCents: number
  rsdCents: number
}

export type ReportTableTotals = ReportRowTotals

export const getRowTotals = (row: ReportRow): ReportRowTotals => {
  const goodsForeign = row.amounts.goods.foreignCents ?? 0
  const servicesForeign = row.amounts.services.foreignCents ?? 0
  const goodsRsd = row.amounts.goods.rsdCents ?? 0
  const servicesRsd = row.amounts.services.rsdCents ?? 0

  return {
    foreignCents: goodsForeign + servicesForeign,
    rsdCents: goodsRsd + servicesRsd,
  }
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
