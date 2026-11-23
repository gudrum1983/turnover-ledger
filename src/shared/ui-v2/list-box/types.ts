/** Пункт списка ListBox (используется в ButtonDropdown и FieldCombobox). */
export type ListBoxOption = {
  /** Значение для v-model. Не отображается пользователю. */
  value: string
  /** Основной текст в кнопке и списке. */
  label: string
  /** Дополнительный текст в списке, отображается приглушённым цветом. */
  description?: string
  /**
   * Слова для поиска в FieldCombobox (кроме label и value). Если заданы, description в поиске не участвует:
   * например, чтобы искать по названию валюты, но не по цифрам курса.
   */
  keywords?: string[]
  /** Подпись в поле FieldCombobox у выбранного варианта (при showDescription). По умолчанию — description. */
  selectedDescription?: string
}
