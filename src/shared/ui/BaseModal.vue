<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import BasePaper from '@/shared/ui/BasePaper.vue'

const {
  open,
  closeOnOverlay = false,
  closeOnEsc = false,
} = defineProps<{
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
    <div v-if="open" class="BaseModal" role="dialog" aria-modal="true">
      <div class="BaseModal_Overlay" @click.self="handleOverlayClick">
        <BasePaper class="BaseModal_Panel">
          <div class="BaseModal_Content">
            <slot />
          </div>
          <div v-if="$slots.actions" class="BaseModal_Actions">
            <slot name="actions" />
          </div>
        </BasePaper>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.BaseModal {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.BaseModal_Overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-overlay);
}

.BaseModal_Panel {
  max-width: min(720px, 100%);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.BaseModal_Content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.BaseModal_Actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
