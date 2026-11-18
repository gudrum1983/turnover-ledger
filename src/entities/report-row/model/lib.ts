import type { ReportRow } from './types'
import { LOCAL_CURRENCY_CODE } from '@/shared/constants/app'

export type ReportRowTotals = {
  foreignCents: number
  rsdCents: number
}

/** Строка в иностранной валюте: есть валюта и это не RSD. У строк в RSD суммы в валюте не показываем. */
export const isForeignCurrencyRow = (row: ReportRow): boolean => {
  const code = row.currency?.trim().toUpperCase()
  return Boolean(code) && code !== LOCAL_CURRENCY_CODE
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
