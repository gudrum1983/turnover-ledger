<script setup lang="ts">
import { ModalBase } from '@/shared/ui/modal-base'
import type { ModalBaseSize } from '@/shared/ui/modal-base'
import { ButtonBase } from '@/shared/ui/button-base'
import vAutofocus from '@/shared/lib/directives/autofocus'

const {
  open,
  size = 'xs',
  type = 'info',
  title,
  message,
  labelCloseButton = 'Close',
  autoFocusCloseButton = true,
} = defineProps<{
  /** Управляет видимостью диалога */
  open: boolean
  /** Размер модального окна */
  size?: ModalBaseSize
  /** Визуальный тип уведомления */
  type?: 'info' | 'danger' | 'success'
  /** Заголовок диалога */
  title: string
  /** Основной текст сообщения */
  message: string
  /** Текст кнопки закрытия */
  labelCloseButton?: string
  /** Ставит автофокус на кнопку закрытия при открытии */
  autoFocusCloseButton?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

function closeDialog() {
  emit('update:open', false)
}
</script>

<template>
  <ModalBase
    :open="open"
    rootClass="DialogAlert"
    @update:open="closeDialog"
    shouldCloseOnOverlay
    shouldCloseOnEsc
    :size="size"
  >
    <h2 class="DialogAlert_Title Text_AlginCenter Typo_Heading2" :class="`DialogAlert_Title_type_${type}`">
      {{ title }}
    </h2>
    <div v-if="$slots.content" class="DialogAlert_Content Text_AlginCenter Typo_BodyAccent">
      <slot name="content" />
    </div>
    <p class="DialogAlert_Message Text_AlginCenter Typo_Body">{{ message }}</p>
    <template #actions>
      <ButtonBase v-autofocus="autoFocusCloseButton" size="lg" :color="type" @click="closeDialog">{{
        labelCloseButton
      }}</ButtonBase>
    </template>
  </ModalBase>
</template>

<style scoped lang="scss">
.DialogAlert {
  &_Title {
    &_type {
      &_info {
        color: var(--color-text-info);
      }

      &_danger {
        color: var(--color-text-danger);
      }

      &_success {
        color: var(--color-text-success);
      }
    }
  }

  &_Content {
    color: var(--color-text-secondary);
    overflow-wrap: break-word;
  }
}
</style>
