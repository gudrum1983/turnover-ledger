import type { CurrencyResponse } from '@/shared/types/currency.ts'

/*https://nbs-rates.gudrum1983.workers.dev/api/v1/currencies*/
/*https://kurs.resenje.org/api/v1/currencies*/

const CURRENCIES_URL = 'https://nbs-rates.gudrum1983.workers.dev/api/v1/currenciess'

export async function fetchCurrencies(): Promise<CurrencyResponse> {
  const response = await fetch(CURRENCIES_URL)

  if (!response.ok) {
    throw new Error(`Currencies request failed: ${response.status}`)
  }

  return (await response.json()) as CurrencyResponse
}
