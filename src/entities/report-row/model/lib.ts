import type { ReportRow } from './types'

export type ReportRowTotals = {
  foreignCents: number
  rsdCents: number
}

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
