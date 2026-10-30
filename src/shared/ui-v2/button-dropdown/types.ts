export type DropdownTypography = 'body-m' | 'button-l' | 'button-m'
export type DropdownPlacement = 'left' | 'center' | 'right'

export type DropdownOption = {
  /** Значение для v-model. Не отображается пользователю. */
  value: string
  /** Основной текст в кнопке и списке. */
  label: string
  /** Дополнительный текст в списке, отображается приглушённым цветом. */
  description?: string
}
