export type ModalBaseSize = 'xs' | 'sm' | 'md' | 'lg'

export type ModalBaseProps = {
  /** Размер модального окна */
  size?: ModalBaseSize
  /** Управляет видимостью модального окна */
  open: boolean
  /** Разрешает закрытие по клику на overlay */
  shouldCloseOnOverlay?: boolean
  /** Разрешает закрытие по клавише Escape */
  shouldCloseOnEsc?: boolean
  rootClass?: string
}
