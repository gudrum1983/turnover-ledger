import { createI18n } from 'vue-i18n'
import { messagesByLocale } from './messages'
import { DEFAULT_LOCALE } from './locales.ts'
import type { I18nLocale } from './locales.ts'
import { pluralRules } from './pluralRules'

// Глобальный экземпляр vue-i18n.
// Сообщения берем из уже существующих словарей, поэтому структуру файлов менять не нужно.
export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: messagesByLocale,
  pluralRules,
})

// Небольшой helper, чтобы хранить смену локали в одном месте.
// Его можно вызывать из store после hydrate/setLocale.
export function setI18nLocale(locale: I18nLocale) {
  i18n.global.locale.value = locale
}
