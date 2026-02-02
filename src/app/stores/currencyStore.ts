import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import { fetchCurrencies } from '@/shared/api/currencies.ts'
import type { Currency } from '@/shared/types/currency.ts'
import { FALLBACK_CURRENCIES } from '@/shared/types/report.ts'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'

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
  const metaDataStore = useMetaDataStore()

  const BASE_FAVORITE_CODES = ['USD', 'EUR', 'RSD'] as const
  const currencyCodes = computed(() =>
    currencies.value.length > 0 ? currencies.value.map((currency) => currency.code) : [...FALLBACK_CURRENCIES],
  )
  const favoriteCurrencyCodes = computed(() => {
    const unique = new Set<string>()
    const ordered: string[] = []

    const addCode = (code: string) => {
      const normalized = code.trim().toUpperCase()
      if (!normalized || unique.has(normalized)) return
      unique.add(normalized)
      ordered.push(normalized)
    }

    for (const code of BASE_FAVORITE_CODES) {
      addCode(code)
    }

    for (const row of metaDataStore.rows) {
      if (typeof row.currency === 'string') {
        addCode(row.currency)
      }
    }

    return ordered
  })

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

  function convertAmount(amount: number, from: string, to: string): number {
    void amount
    void from
    void to
    /*todo - убрать мок*/
    return amount
  }

  return {
    currencies,
    currencyCodes,
    favoriteCurrencyCodes,
    isLoading,
    error,
    updatedAt,
    hydrateFromLocalStorage,
    loadCurrencies,
    convertAmount,
  }
})
