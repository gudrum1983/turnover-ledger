import type { Currency } from '@/shared/types/currency.ts'
import type { FooterField, HeaderField } from '@/shared/constants/reportFields.ts'

export const FALLBACK_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'] as const

export type ForeignCurrency = Currency['code'] | (typeof FALLBACK_CURRENCIES)[number]

export type MoneyPart = {
  rsdCents: number
  foreignCents?: number | null
}

export type ReportRow = {
  date: string
  description: string
  currency: ForeignCurrency | null
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
