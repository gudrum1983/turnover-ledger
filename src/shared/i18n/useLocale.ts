import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/app/stores/localeStore.ts'
import type { I18nMessageKey } from './types'
import type { I18nLocale } from './locales.ts'

export function useLocale() {
  const localeStore = useLocaleStore()
  const { t: i18nTranslate } = useI18n({ useScope: 'global' })

  const locale = computed(() => localeStore.currentLocale)

  const t = (key: I18nMessageKey): string => i18nTranslate(key)

  const setLocale = (next: I18nLocale) => {
    localeStore.setLocale(next)
  }

  return {
    locale,
    setLocale,
    t,
  }
}
