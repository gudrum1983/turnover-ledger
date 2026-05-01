import type { CurrencyCode } from '@/shared/types'

export type Currency = {
  code: CurrencyCode
  number: number
  country: string
  since: string
  until: string
}

export type CurrencyResponse = {
  currencies: Currency[]
}

export type ConversionResponse = {
  rate: {
    code: string
    date: string
    date_from: string
    number: number
    parity: number
    cash_buy: number
    cash_sell: number
    exchange_buy: number
    exchange_middle: number
    exchange_sell: number
  }
  buy_middle: number
  sell_middle: number
  buy_exchange: number
  sell_exchange: number
  buy_cash: number
  sell_cash: number
}
