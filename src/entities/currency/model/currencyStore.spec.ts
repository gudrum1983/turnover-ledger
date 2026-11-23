import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrencyStore } from './currencyStore'
import { fetchRates } from '../api/currencies'

vi.mock('../api/currencies', () => ({
  fetchCurrencies: vi.fn(),
  fetchConversion: vi.fn(),
  fetchRates: vi.fn(),
}))

const fetchRatesMock = vi.mocked(fetchRates)

describe('currencyStore.loadRates', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchRatesMock.mockReset()
  })

  it('сохраняет курсы как в листе НБС, вместе с parity, и пропускает валюты без среднего курса', async () => {
    fetchRatesMock.mockResolvedValue({
      rates: [
        { code: 'EUR', date: '2026-01-25', date_from: '2026-01-23', number: 978, parity: 1, exchange_middle: 117.2 },
        { code: 'jpy', date: '2026-01-25', date_from: '2026-01-23', number: 392, parity: 100, exchange_middle: 68.5 },
        { code: 'XXX', date: '2026-01-25', date_from: '2026-01-23', number: 1, parity: 1 },
      ],
    })
    const store = useCurrencyStore()

    await store.loadRates('2026-01-25')

    expect(store.ratesByDate['2026-01-25']).toEqual({
      EUR: { rate: 117.2, parity: 1 },
      JPY: { rate: 68.5, parity: 100 },
    })
  })

  it('не повторяет запрос для той же даты, в том числе параллельный', async () => {
    fetchRatesMock.mockResolvedValue({ rates: [] })
    const store = useCurrencyStore()

    await Promise.all([store.loadRates('2026-01-25'), store.loadRates('2026-01-25')])
    await store.loadRates('2026-01-25')

    expect(fetchRatesMock).toHaveBeenCalledTimes(1)
  })

  it('не падает при ошибке и запрашивает дату снова в следующий раз', async () => {
    fetchRatesMock.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ rates: [] })
    const store = useCurrencyStore()

    await expect(store.loadRates('2026-01-25')).resolves.toBeUndefined()
    expect(store.ratesByDate['2026-01-25']).toBeUndefined()
    expect(store.ratesErrorDates['2026-01-25']).toBe(true)

    await store.loadRates('2026-01-25')
    expect(fetchRatesMock).toHaveBeenCalledTimes(2)
    expect(store.ratesByDate['2026-01-25']).toEqual({})
    expect(store.ratesErrorDates['2026-01-25']).toBeUndefined()
  })
})
