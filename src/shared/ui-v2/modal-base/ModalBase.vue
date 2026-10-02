<script lang="ts">
export type ModalBaseSize = 'xs' | 'sm' | 'md' | 'lg'
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { IconClose } from '@/shared/ui-v2/icons'
import { ButtonIcon } from '@/shared/ui-v2/button-icon'
import { useLocale } from '@/shared/i18n'

type ModalBaseProps = {
  /** Управляет видимостью модального окна */
  open: boolean
  /**  Заголовок модального окна */
  title: string
  /**  Определяет наличие кнопки закрытия */
  hasCloseButton?: boolean
  /** Разрешает закрытие по клику на overlay */
  shouldCloseOnOverlay?: boolean
  /** Разрешает закрытие по клавише Escape */
  shouldCloseOnEsc?: boolean
  rootClass?: string
}

const {
  open = false,
  shouldCloseOnOverlay = false,
  shouldCloseOnEsc = false,
  hasCloseButton = false,
  title,
  rootClass = '',
} = defineProps<ModalBaseProps>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const isClient = typeof document !== 'undefined'
const container = ref<HTMLElement>()
const titleId = useId()
let previousFocus: HTMLElement | null = null

const { t } = useLocale()

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !container.value) return
  const elements = Array.from(
    container.value.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.getClientRects().length > 0)
  const first = elements[0]
  const last = elements.at(-1)
  if (!first) {
    event.preventDefault()
    container.value.focus()
  } else if (event.shiftKey && (document.activeElement === first || document.activeElement === container.value)) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === container.value)) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => open,
  async (value) => {
    if (!isClient) return
    if (value) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      if (open) container.value?.focus()
    } else {
      previousFocus?.focus()
      previousFocus = null
    }
  },
  { immediate: true },
)

function closeModal() {
  if (!open) return
  emit('update:open', false)
}

const handleOverlayClick = () => {
  if (!shouldCloseOnOverlay) {
    return
  }

  closeModal()
}

let hasEscListener = false
let originalBodyOverflow: string | null = null

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !shouldCloseOnEsc) {
    return
  }

  closeModal()
}

const toggleEscListener = (shouldListen: boolean) => {
  if (!isClient) {
    return
  }

  if (shouldListen && !hasEscListener) {
    document.addEventListener('keydown', handleKeydown)
    hasEscListener = true
    return
  }

  if (!shouldListen && hasEscListener) {
    document.removeEventListener('keydown', handleKeydown)
    hasEscListener = false
  }
}

const setBodyScrollLock = (shouldLock: boolean) => {
  if (!isClient) {
    return
  }

  if (shouldLock) {
    if (originalBodyOverflow === null) {
      originalBodyOverflow = document.body.style.overflow
    }
    document.body.style.overflow = 'hidden'
    return
  }

  if (originalBodyOverflow !== null) {
    document.body.style.overflow = originalBodyOverflow
    originalBodyOverflow = null
  } else {
    document.body.style.removeProperty('overflow')
  }
}

watch(
  () => open && shouldCloseOnEsc,
  (shouldListenEsc) => {
    toggleEscListener(shouldListenEsc)
  },
  { immediate: true },
)

watch(
  () => open,
  (shouldLockScroll) => {
    setBodyScrollLock(shouldLockScroll)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  toggleEscListener(false)
  setBodyScrollLock(false)
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-from-class="ModalBase_enterFrom"
      enter-active-class="ModalBase_enterActive"
      enter-to-class="ModalBase_enterTo"
      leave-from-class="ModalBase_leaveFrom"
      leave-active-class="ModalBase_leaveActive"
      leave-to-class="ModalBase_leaveTo"
      appear
    >
      <div
        v-if="open"
        class="ModalBase"
        :class="rootClass"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-hidden="!open || undefined"
        :inert="!open"
        @keydown="trapFocus"
      >
        <div class="ModalBase-Overlay" @click.self="handleOverlayClick">
          <div ref="container" class="ModalBase-Container" tabindex="-1">
            <div class="ModalBase-Header">
              <span :id="titleId" class="ModalBase-Title u-typo-subtitle-l"> {{ title }} </span>

              <ButtonIcon
                v-if="hasCloseButton"
                :ariaLabel="t('ui.importDataModal.close')"
                @click="closeModal"
                variant="card"
              >
                <IconClose size="xl" />
              </ButtonIcon>
            </div>

            <div class="ModalBase-Content">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.ModalBase {
  position: fixed;
  inset: 0;
  z-index: 1000;

  &-Overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--backdrop);
    padding: 16px;
  }

  &-Container {
    box-sizing: border-box;
    background: var(--white);
    border-radius: 32px;
    max-height: 100%;
    overflow-y: auto;
    outline: none;
    max-width: min(640px, 100%);
    padding: 32px 24px 24px 24px;
    width: 100%;
    box-shadow: 0 7px 25px 0 #00000040;
  }

  &-Header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  &-CloseButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
}

.ModalBase_enterActive,
.ModalBase_leaveActive {
  transition: opacity var(--transition-duration-modal-enter) var(--transition-easing-modal);

  .ModalBase-Container {
    transition: transform var(--transition-duration-modal-enter) var(--transition-easing-modal);
  }
}

.ModalBase_leaveActive {
  pointer-events: none;
  transition-duration: var(--transition-duration-modal-leave);

  .ModalBase-Container {
    transition-duration: var(--transition-duration-modal-leave);
  }
}

.ModalBase_enterFrom,
.ModalBase_leaveTo {
  opacity: 0;

  .ModalBase-Container {
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ModalBase_enterFrom,
  .ModalBase_leaveTo {
    .ModalBase-Container {
      transform: none;
    }
  }
}
</style>
