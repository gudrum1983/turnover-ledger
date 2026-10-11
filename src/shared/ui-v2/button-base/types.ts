export type ButtonSize = 'l' | 'm'

export type ButtonProps = {
  /** Визуальный вариант кнопки */
  variant?: 'page' | 'accent' | 'success' | 'danger' | 'card'
  /** Растягивает кнопку на всю ширину контейнера */
  fullWidth?: boolean
  /** Убирает внутренние отступы и задаёт одинаковую ширину и высоту кнопки без текста */
  iconOnly?: boolean
  /** Размер типографики и иконки: l — крупный, m — средний */
  size?: ButtonSize
  /** HTML-тип кнопки */
  type?: 'button' | 'submit' | 'reset'
  /** Отключает взаимодействие с кнопкой */
  disabled?: boolean
}
