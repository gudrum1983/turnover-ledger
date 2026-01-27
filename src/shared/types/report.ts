export type ForeignCurrency = 'EUR' | 'USD' | 'GBP' | 'CHF'

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
