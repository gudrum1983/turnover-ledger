import type { CurrencyCode } from '@/shared/types/currency.ts'
import type { FooterField, HeaderField } from '@/shared/constants/reportFields.ts'

export type MoneyPart = {
  rsdCents: number
  foreignCents?: number | null
}

export type ReportRow = {
  id: string
  date: string
  description: string
  currency: CurrencyCode
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
