import type { ConversionResponse, CurrencyResponse } from '../model/types'

/*https://nbs-rates.gudrum1983.workers.dev/api/v1/currencies*/
/*https://kurs.resenje.org/api/v1/currencies*/

const CURRENCIES_URL = 'https://nbs-rates.gudrum1983.workers.dev/api/v1/currencies'

export async function fetchCurrencies(): Promise<CurrencyResponse> {
  const response = await fetch(CURRENCIES_URL)

  if (!response.ok) {
    throw new Error(`Currencies request failed: ${response.status}`)
  }

  return (await response.json()) as CurrencyResponse
}

export async function fetchConversion(currencyCode: string, amount: number, date: string): Promise<ConversionResponse> {
  const normalizedCode = currencyCode.trim().toLowerCase()
  const normalizedAmount = Number.isFinite(amount) ? amount.toString() : '0'
  const normalizedDate = date.trim()
  const url = `${CURRENCIES_URL}/${normalizedCode}/conversions/${normalizedAmount}/${normalizedDate}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Conversion request failed: ${response.status}`)
  }

  return (await response.json()) as ConversionResponse
}
