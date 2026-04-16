<script setup lang="ts">
import { ModalBase } from '@/shared/ui/modal-base'
import type { ModalBaseSize } from '@/shared/ui/modal-base'
import { ButtonBase } from '@/shared/ui/button-base'
import vAutofocus from '@/shared/lib/directives/autofocus'

const {
  open,
  size = 'xs',
  title,
  message,
  type,
  labelActiveButton = 'Action',
  labelCancelButton = 'Cancel',
  autoFocusCancelButton = true,
} = defineProps<{
  open: boolean
  size?: ModalBaseSize
  type: 'confirm' | 'delete'
  message: string
  title: string
  labelActiveButton?: string
  labelCancelButton?: string
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
    :open="open"
    rootClass="DialogConfirm"
    @update:open="closeDialog"
    shouldCloseOnOverlay
    shouldCloseOnEsc
    :size="size"
  >
    <h2 class="Text_AlginCenter Typo_Heading2">{{ title }}</h2>
    <div v-if="$slots.content" class="DialogConfirm_Content Text_AlginCenter Typo_BodyAccent">
      <slot name="content" />
    </div>
    <p class="DialogConfirm_Message Text_AlginCenter Typo_Body">{{ message }}</p>
    <template #actions>
      <ButtonBase v-autofocus="autoFocusCancelButton" size="lg" color="default" @click="handleCancel">{{
        labelCancelButton
      }}</ButtonBase>

      <ButtonBase size="lg" color="success" v-if="type === 'confirm'" @click="emit('confirm')">{{
        labelActiveButton
      }}</ButtonBase>
      <ButtonBase size="lg" color="danger" v-if="type === 'delete'" @click="emit('confirm')">{{
        labelActiveButton
      }}</ButtonBase>
    </template>
  </ModalBase>
</template>

<style scoped lang="scss">
.DialogConfirm {
  &_Content {
    color: var(--color-text-secondary);
    overflow-wrap: break-word;
  }
}
</style>
