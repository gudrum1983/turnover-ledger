import { afterEach, describe, expect, it, vi } from 'vitest'
import { CurrencyApiError, fetchConversion, fetchCurrencies } from './currencies'

describe('currency api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns currencies on successful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ currencies: [{ code: 'EUR' }] }),
    } as Response)

    await expect(fetchCurrencies()).resolves.toEqual({
      currencies: [{ code: 'EUR' }],
    })
  })

  it('throws typed error when currencies response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
    } as Response)

    await expect(fetchCurrencies()).rejects.toEqual(
      expect.objectContaining<Partial<CurrencyApiError>>({
        name: 'CurrencyApiError',
        message: 'Currencies request failed: 503',
        status: 503,
      }),
    )
  })

  it('throws typed error when conversion response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 422,
    } as Response)

    await expect(fetchConversion('eur', 100, '2026-05-01')).rejects.toEqual(
      expect.objectContaining<Partial<CurrencyApiError>>({
        name: 'CurrencyApiError',
        message: 'Conversion request failed: 422',
        status: 422,
      }),
    )
  })
})
