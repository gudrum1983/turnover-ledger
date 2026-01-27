export type Currency = {
  code: string
  number: number
  country: string
  since: string
  until: string
}

export type CurrencyResponse = {
  currencies: Currency[]
}
