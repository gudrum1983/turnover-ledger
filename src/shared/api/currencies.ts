import type { CurrencyResponse } from '@/shared/types/currency.ts'

const CURRENCIES_URL = 'https://kurs.resenje.org/api/v1/currencies'

export async function fetchCurrencies(): Promise<CurrencyResponse> {
  const response = await fetch(CURRENCIES_URL)

  if (!response.ok) {
    throw new Error(`Currencies request failed: ${response.status}`)
  }

  return (await response.json()) as CurrencyResponse
}
