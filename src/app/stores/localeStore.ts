import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import { enUS, ru, sr, srLatn } from 'date-fns/locale'

export type AppLocale = 'ru' | 'en' | 'srLat' | 'srCyr'

const localeMap = {
  ru,
  en: enUS,
  srLat: srLatn,
  srCyr: sr,
} as const

export const useLocaleStore = defineStore(STORE_NAME.Locale, () => {
  const currentLocale = ref<AppLocale>('ru')

  const dateFnsLocale = computed(() => localeMap[currentLocale.value])

  function setLocale(locale: AppLocale) {
    currentLocale.value = locale
  }

  return {
    currentLocale,
    dateFnsLocale,
    setLocale,
  }
})
