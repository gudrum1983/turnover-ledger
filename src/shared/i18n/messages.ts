import type { I18nLocaleMessages } from './types'
import type { I18nLocale } from './locales.ts'
import { baseLocaleMessages } from './types'
import { enReport } from './locales/en/report'
import { enUi } from './locales/en/ui'
import { srCyrReport } from './locales/srCyr/report'
import { srCyrUi } from './locales/srCyr/ui'
import { srLatReport } from './locales/srLat/report'
import { srLatUi } from './locales/srLat/ui'

export const messagesByLocale: Record<I18nLocale, I18nLocaleMessages> = {
  ru: baseLocaleMessages,
  en: {
    report: enReport,
    ui: enUi,
  },
  srLat: {
    report: srLatReport,
    ui: srLatUi,
  },
  srCyr: {
    report: srCyrReport,
    ui: srCyrUi,
  },
}
