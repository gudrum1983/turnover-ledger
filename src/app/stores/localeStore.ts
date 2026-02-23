import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import { enUS, ru, sr, srLatn } from 'date-fns/locale'
import { DEFAULT_LOCALE, isSupportedLocale, setI18nLocale } from '@/shared/i18n'
import type { I18nLocale } from '@/shared/i18n'

const LOCAL_STORAGE_KEY = 'localeState'

const localeMap = {
  ru,
  en: enUS,
  srLat: srLatn,
  srCyr: sr,
} as const

export const useLocaleStore = defineStore(STORE_NAME.Locale, () => {
  const currentLocale = ref<I18nLocale>(DEFAULT_LOCALE)

  const dateFnsLocale = computed(() => localeMap[currentLocale.value])

  function setLocale(locale: I18nLocale) {
    currentLocale.value = locale
    setI18nLocale(locale)
  }

  function hydrateFromLocalStorage() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!savedState) return

    try {
      const parsed = JSON.parse(savedState) as { locale?: string }
      if (typeof parsed.locale === 'string' && isSupportedLocale(parsed.locale)) {
        currentLocale.value = parsed.locale
        setI18nLocale(parsed.locale)
      }
    } catch {
      // ignore invalid data in localStorage
    }
  }

  watch(currentLocale, (locale) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ locale }))
  })

  return {
    currentLocale,
    dateFnsLocale,
    setLocale,
    hydrateFromLocalStorage,
  }
})
