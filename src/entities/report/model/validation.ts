import type { I18nMessageKey } from '@/shared/i18n'
import type { HeaderField } from './fields'

// Мягкая проверка реквизитов: значение похоже на опечатку. Реквизиты ни на что не влияют и печать
// не блокируют — это только подсказка пользователю. Проверяем только ПИБ и матични број: у них
// фиксированная длина, и пропущенную цифру на распечатке не заметить. В именах ищем только цифры:
// в имени человека их не бывает, это почти наверняка ошибка (например, ПИБ не в том поле).
// Форму имени и код деятельности не проверяем: у правильных значений слишком много вариантов
// («Petar P. Petrović», «6201», «62.01 - IT»), а ложное предупреждение хуже его отсутствия.
export function getPersonNameWarning(value: string): I18nMessageKey | undefined {
  return /[0-9]/.test(value) ? 'ui.reportBuilderMetaFields.validation.personName' : undefined
}

export function getHeaderFieldWarning(field: HeaderField, value: string): I18nMessageKey | undefined {
  if (field === 'taxpayer') return getPersonNameWarning(value)
  if (field === 'pib' && !/^(?:[0-9]{9}|[0-9]{13})$/.test(value)) {
    return 'ui.reportBuilderMetaFields.validation.pib'
  }
  if (field === 'taxNumber' && !/^(?:[0-9]{8}|[0-9]{13})$/.test(value)) {
    return 'ui.reportBuilderMetaFields.validation.taxNumber'
  }
  return undefined
}
