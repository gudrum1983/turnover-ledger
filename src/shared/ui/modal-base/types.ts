export type ModalBaseSize = 'xs' | 'sm' | 'md' | 'lg'

export type ModalBaseProps = {
  size?: ModalBaseSize
  open: boolean
  shouldCloseOnOverlay?: boolean
  shouldCloseOnEsc?: boolean
}
