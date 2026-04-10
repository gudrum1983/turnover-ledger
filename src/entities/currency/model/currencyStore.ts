import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchConversion, fetchCurrencies } from '../api/currencies'
import type { ConversionResponse, Currency, CurrencyCode } from './types'

const STORE_ID = 'currencies-store'
const LOCAL_STORAGE_KEY = 'currenciesState'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const BASE_FAVORITE_CODES = ['USD', 'EUR', 'RSD'] as const
const UNTIL_DATE = new Date('2020-01-01')

type CurrencyCache = {
  currencies: CurrencyCode[]
  updatedAt: string
}

export const useCurrencyStore = defineStore(STORE_ID, () => {
  const currencies = ref<CurrencyCode[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const updatedAt = ref<string | null>(null)

  function isActiveCurrencies(currency: Currency) {
    if (!currency.country?.trim()) return false

    if (new Date(currency.until) < UNTIL_DATE) return false

    return true
  }

  function favoriteCurrencyCodes(usedCodes: string[]) {
    const unique = new Set<string>()
    const ordered: string[] = []
    const available = new Set(currencies.value.map((code) => code.trim().toUpperCase()))

    const addCode = (code: string) => {
      const normalized = code.trim().toUpperCase()
      if (!normalized || unique.has(normalized)) return
      unique.add(normalized)
      ordered.push(normalized)
    }

    for (const code of BASE_FAVORITE_CODES) {
      if (available.has(code)) addCode(code)
    }

    for (const code of usedCodes) {
      if (available.has(code.trim().toUpperCase())) addCode(code)
    }

    return ordered
  }

  function isCacheFresh(): boolean {
    if (!updatedAt.value) return false
    const timestamp = Date.parse(updatedAt.value)
    if (Number.isNaN(timestamp)) return false
    return Date.now() - timestamp < CACHE_TTL_MS
  }

  function hydrateFromLocalStorage() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!savedState) return

    try {
      const parsed = JSON.parse(savedState) as CurrencyCache

      if (Array.isArray(parsed?.currencies)) {
        currencies.value = parsed.currencies
      }

      if (typeof parsed?.updatedAt === 'string') {
        updatedAt.value = parsed.updatedAt
      }
    } catch {
      // ignore invalid data in localStorage
    }
  }

  function persistToLocalStorage() {
    const payload: CurrencyCache = {
      currencies: currencies.value,
      updatedAt: updatedAt.value ?? new Date().toISOString(),
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  }

  async function loadCurrencies() {
    if (isLoading.value) return
    if (currencies.value.length > 0 && isCacheFresh()) return

    isLoading.value = true
    error.value = null

    try {
      const response = await fetchCurrencies()
      currencies.value = response.currencies.filter(isActiveCurrencies).map((currency) => currency.code)
      updatedAt.value = new Date().toISOString()
      persistToLocalStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  async function convertAmount(currencyCode: string, amount: number, date: string): Promise<ConversionResponse> {
    return await fetchConversion(currencyCode, amount, date)
  }

  return {
    currencies,
    favoriteCurrencyCodes,
    isLoading,
    error,
    updatedAt,
    hydrateFromLocalStorage,
    loadCurrencies,
    convertAmount,
  }
})
