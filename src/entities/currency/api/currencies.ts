import type { ConversionResponse, CurrencyResponse, RatesResponse } from '../model/types'
import { EXCHANGE_RATE_API_URL, EXCHANGE_RATES_BY_DATE_API_URL } from '@/shared/constants/app.ts'

export class CurrencyApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'CurrencyApiError'
    this.status = status
  }
}

const REQUEST_ERROR_LABELS = {
  currencies: 'Currencies request failed',
  conversion: 'Conversion request failed',
  rates: 'Rates request failed',
}

function createRequestError(resource: keyof typeof REQUEST_ERROR_LABELS, status: number) {
  const label = REQUEST_ERROR_LABELS[resource]

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

/** Курсы всех валют на дату YYYY-MM-DD. */
export async function fetchRates(date: string): Promise<RatesResponse> {
  const response = await fetch(`${EXCHANGE_RATES_BY_DATE_API_URL}/${date.trim()}`)

  if (!response.ok) {
    throw createRequestError('rates', response.status)
  }

  return (await response.json()) as RatesResponse
}
