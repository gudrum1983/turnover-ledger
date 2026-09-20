export type ButtonSize = 'desktop' | 'mobile'

export type ButtonProps = {
  /** Визуальный вариант кнопки */
  variant?: 'page' | 'accent' | 'success' | 'danger' | 'card'
  /** Растягивает кнопку на всю ширину контейнера */
  fullWidth?: boolean
  /** Размер текста и иконки для настольного или мобильного интерфейса */
  size?: ButtonSize
  /** HTML-тип кнопки */
  type?: 'button' | 'submit' | 'reset'
  /** Отключает взаимодействие с кнопкой */
  disabled?: boolean
}
