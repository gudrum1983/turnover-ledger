<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { PaperBase } from '../paper-base'

const {
  size = 'md',
  open,
  closeOnOverlay = false,
  closeOnEsc = false,
} = defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg'
  open: boolean
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const handleOverlayClick = () => {
  if (closeOnOverlay) {
    emit('close')
  }
}

let isEscListenerActive = false
let originalBodyOverflow: string | null = null

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && closeOnEsc) {
    emit('close')
  }
}

const updateEscListener = (shouldListen: boolean) => {
  if (shouldListen && !isEscListenerActive) {
    document.addEventListener('keydown', handleKeydown)
    isEscListenerActive = true
    return
  }

  if (!shouldListen && isEscListenerActive) {
    document.removeEventListener('keydown', handleKeydown)
    isEscListenerActive = false
  }
}

const updateBodyScrollLock = (shouldLock: boolean) => {
  if (typeof document === 'undefined') {
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
  () => [open, closeOnEsc],
  ([isOpen, allowEsc]) => {
    updateEscListener(Boolean(isOpen && allowEsc))
    updateBodyScrollLock(Boolean(isOpen))
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  updateEscListener(false)
  updateBodyScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ModalBase" role="dialog" aria-modal="true">
      <div class="ModalBase_Overlay" @click.self="handleOverlayClick">
        <PaperBase class="ModalBase_Panel" :class="`ModalBase_Panel_size_${size}`">
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
}

.ModalBase_Overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-overlay);
}

.ModalBase_Panel {
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

.ModalBase_Content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ModalBase_Actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
