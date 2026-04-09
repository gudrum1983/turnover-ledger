import type { CurrencyCode } from '@/entities/currency'

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
