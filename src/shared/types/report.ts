import type { Currency } from '@/shared/types/currency.ts'

export const FALLBACK_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'] as const

export type ForeignCurrency = Currency['code'] | (typeof FALLBACK_CURRENCIES)[number]

export type MoneyPart = {
  rsdCents: number
  foreignCents?: number | null
}

export type ReportRow = {
  date: string
  description: string
  counterparty: string
  currency: ForeignCurrency | null
  amounts: {
    goods: MoneyPart
    services: MoneyPart
  }
}
