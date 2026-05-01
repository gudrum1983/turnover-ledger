<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { PaperBase } from '@/shared/ui/paper-base'
import type { ModalBaseProps } from './types'

const {
  size = 'md',
  open = false,
  shouldCloseOnOverlay = false,
  shouldCloseOnEsc = false,
  rootClass = '',
} = defineProps<ModalBaseProps>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const isClient = typeof document !== 'undefined'

function closeModal() {
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
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ModalBase" :class="rootClass" role="dialog" aria-modal="true">
      <div class="ModalBase_Overlay" @click.self="handleOverlayClick">
        <PaperBase class="ModalBase_Container" :class="`ModalBase_Container_size_${size}`">
          <div class="ModalBase_Content">
            <slot />
          </div>
          <div v-if="$slots.actions" class="ModalBase_Actions">
            <slot name="actions" />
          </div>
        </PaperBase>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.ModalBase {
  position: fixed;
  inset: 0;
  z-index: 1000;

  &_Overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background-overlay);
  }

  &_Container {
    max-width: min(740px, 100%);
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &_size {
      &_xs {
        max-width: min(400px, 100%);
      }
      &_sm {
        max-width: min(600px, 100%);
      }
      &_md {
        max-width: min(740px, 100%);
      }
      &_lg {
        max-width: min(800px, 100%);
      }
    }
  }

  &_Content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &_Actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
