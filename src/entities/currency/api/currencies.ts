import type { ConversionResponse, CurrencyResponse } from '../model/types'
import { EXCHANGE_RATE_API_URL } from '@/shared/constants/app.ts'

export class CurrencyApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'CurrencyApiError'
    this.status = status
  }
}

function createRequestError(resource: 'currencies' | 'conversion', status: number) {
  const label = resource === 'currencies' ? 'Currencies request failed' : 'Conversion request failed'

  return new CurrencyApiError(`${label}: ${status}`, status)
}

export async function fetchCurrencies(): Promise<CurrencyResponse> {
  const response = await fetch(EXCHANGE_RATE_API_URL)

  if (!response.ok) {
    throw createRequestError('currencies', response.status)
  }

  return (await response.json()) as CurrencyResponse
}

export async function fetchConversion(currencyCode: string, amount: number, date: string): Promise<ConversionResponse> {
  const normalizedCode = currencyCode.trim().toLowerCase()
  const normalizedAmount = Number.isFinite(amount) ? amount.toString() : '0'
  const normalizedDate = date.trim()
  const url = `${EXCHANGE_RATE_API_URL}/${normalizedCode}/conversions/${normalizedAmount}/${normalizedDate}`
  const response = await fetch(url)

  if (!response.ok) {
    throw createRequestError('conversion', response.status)
  }

  return (await response.json()) as ConversionResponse
}
