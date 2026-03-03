import type { CurrencyCode } from './currency'
import type { FooterField, HeaderField } from '../constants/reportFields'

export type MoneyPart = {
  rsdCents: number
  foreignCents?: number | null
}

export type ReportRow = {
  id: string
  date: string
  description: string
  currency: CurrencyCode
  exchangeRate?: number | null
  amounts: {
    goods: MoneyPart
    services: MoneyPart
  }
}

export type ReportMeta = {
  header: Record<HeaderField, string>
  footer: Record<FooterField, string>
}

export type ReportState = {
  meta: ReportMeta
  rows: ReportRow[]
}
