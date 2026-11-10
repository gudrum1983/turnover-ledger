import type { PluralizationRule } from 'vue-i18n'

// Правило плюрализации для славянских языков с тремя формами: one | few | many.
// Пример сообщения: 'запись | записи | записей' (1 запись, 2 записи, 5 записей, 21 запись).
// Категории берём из Intl.PluralRules, чтобы не дублировать правила языка вручную.
export function createSlavicPluralRule(intlLocale: string): PluralizationRule {
  const rules = new Intl.PluralRules(intlLocale)

  return (choice, choicesLength) => {
    const category = rules.select(Math.abs(choice))
    const index = category === 'one' ? 0 : category === 'few' ? 1 : 2
    return Math.min(index, choicesLength - 1)
  }
}

// Для en используется стандартное правило vue-i18n: 'record | records'.
export const pluralRules = {
  ru: createSlavicPluralRule('ru'),
  srLat: createSlavicPluralRule('sr'),
  srCyr: createSlavicPluralRule('sr'),
}
