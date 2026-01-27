import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import { fetchCurrencies } from '@/shared/api/currencies.ts'
import type { Currency } from '@/shared/types/currency.ts'
import { FALLBACK_CURRENCIES } from '@/shared/types/report.ts'

const LOCAL_STORAGE_KEY = 'currenciesState'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

type CurrencyCache = {
  currencies: Currency[]
  updatedAt: string
}

export const useCurrencyStore = defineStore(STORE_NAME.Currencies, () => {
  const currencies = ref<Currency[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const updatedAt = ref<string | null>(null)
  const currencyCodes = computed(() =>
    currencies.value.length > 0 ? currencies.value.map((currency) => currency.code) : [...FALLBACK_CURRENCIES],
  )

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
      currencies.value = response.currencies
      updatedAt.value = new Date().toISOString()
      persistToLocalStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  return {
    currencies,
    currencyCodes,
    isLoading,
    error,
    updatedAt,
    hydrateFromLocalStorage,
    loadCurrencies,
  }
})
