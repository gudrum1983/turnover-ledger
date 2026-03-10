<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { BaseButton } from '../buttons'

const {
  open,
  title,
  message,
  type,
  labelActiveButton = 'Action',
  labelCancelButton = 'Cancel',
  autoFocusCancelButton = true,
} = defineProps<{
  open: boolean
  type: 'confirm' | 'delete'
  message: string
  title: string
  labelActiveButton: string
  labelCancelButton: string
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
  <BaseModal :open="open" closeOnOverlay closeOnEsc @close="closeDialog" size="xs">
    <h2 class="Text_AlginCenter Typo_Heading2">{{ title }}</h2>
    <div v-if="$slots.content" class="ConfirmDialog_Content Text_AlginCenter Typo_BodyAccent">
      <slot name="content" />
    </div>
    <p class="ConfirmDialog_Message Text_AlginCenter Typo_Body">{{ message }}</p>
    <template #actions>
      <BaseButton v-autofocus="autoFocusCancelButton" size="lg" color="default" @click="handleCancel">{{
        labelCancelButton
      }}</BaseButton>

      <BaseButton size="lg" color="success" v-if="type === 'confirm'" @click="emit('confirm')">{{
        labelActiveButton
      }}</BaseButton>
      <BaseButton size="lg" color="danger" v-if="type === 'delete'" @click="emit('confirm')">{{
        labelActiveButton
      }}</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.ConfirmDialog {
  &_Content {
    color: var(--color-text-secondary);
    overflow-wrap: break-word;
  }
}
</style>
