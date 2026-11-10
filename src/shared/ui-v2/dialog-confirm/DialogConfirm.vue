<script setup lang="ts">
import { ModalBase } from '@/shared/ui-v2/modal-base'
import type { ModalBaseSize } from '@/shared/ui-v2/modal-base'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { vAutofocus } from '@/shared/lib'

const {
  open,
  size = 'xs',
  title,
  message,
  details,
  type,
  labelActiveButton = 'Action',
  labelCancelButton = 'Cancel',
  autoFocusCancelButton = true,
} = defineProps<{
  /** Управляет видимостью диалога */
  open: boolean
  /** Размер модального окна */
  size?: ModalBaseSize
  /** Визуальный тип подтверждающего действия */
  type: 'confirm' | 'delete'
  /** Основной текст сообщения */
  message: string
  /** Дополнительный текст под основным сообщением (второстепенный, светлый) */
  details?: string
  /** Заголовок диалога */
  title: string
  /** Текст кнопки подтверждения */
  labelActiveButton?: string
  /** Текст кнопки отмены */
  labelCancelButton?: string
  /** Ставит автофокус на кнопку отмены при открытии */
  autoFocusCancelButton?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

function closeDialog() {
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  closeDialog()
}
</script>

<template>
  <ModalBase
    :title="title"
    :open="open"
    rootClass="DialogConfirm"
    @update:open="closeDialog"
    shouldCloseOnOverlay
    shouldCloseOnEsc
    :size="size"
  >
    <div v-if="$slots.content" class="DialogConfirm_Content Text_AlginCenter Typo_BodyAccent">
      <slot name="content" />
    </div>
    <p class="DialogConfirm_Message u-typo-body-m">{{ message }}</p>
    <p v-if="details" class="DialogConfirm_Message_light u-typo-body-m">{{ details }}</p>
    <div class="DialogConfirm_Actions">
      <ButtonBase variant="page" v-autofocus="autoFocusCancelButton" @click="handleCancel">{{
        labelCancelButton
      }}</ButtonBase>

      <ButtonBase variant="accent" v-if="type === 'confirm'" @click="emit('confirm')">{{
        labelActiveButton
      }}</ButtonBase>
      <ButtonBase variant="accent" v-if="type === 'delete'" @click="emit('confirm')">{{
        labelActiveButton
      }}</ButtonBase>
    </div>
  </ModalBase>
</template>

<style scoped lang="scss">
.DialogConfirm {
  &_Content {
    color: var(--color-text-secondary);
    overflow-wrap: break-word;
  }

  &_Message_light {
    color: var(--neutral-700);
  }

  &_Actions {
    padding-top: 16px;
    display: flex;
    gap: 16px;
    justify-content: flex-end;
  }
}
</style>
