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

/** Курс валюты НБС на дату (элемент ответа /rates/:date). */
export type DailyRate = {
  code: string
  date: string
  /** С какого дня действует курс: в выходные и праздники — последний рабочий день. */
  date_from: string
  number: number
  /** За сколько единиц валюты указан курс (у JPY и HUF — 100). */
  parity: number
  /** Средний курс в RSD за parity единиц. У некоторых валют может не быть. */
  exchange_middle?: number
  exchange_buy?: number
  exchange_sell?: number
}

export type RatesResponse = {
  rates: DailyRate[]
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
