<script setup lang="ts">
import { computed } from 'vue'
import { ModalBase } from '@/shared/ui-v2/modal-base'
import type { ModalBaseSize, ModalBaseTitleVariant } from '@/shared/ui-v2/modal-base'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import type { ButtonProps } from '@/shared/ui-v2/button-base'
import { vAutofocus } from '@/shared/lib'

type DialogConfirmType = 'confirm' | 'delete' | 'error'

const {
  open,
  size = 'xs',
  title,
  message,
  details,
  type,
  labelPrimaryButton,
  labelSecondaryButton = 'Cancel',
  autoFocusCancelButton = true,
} = defineProps<{
  /** Управляет видимостью диалога */
  open: boolean
  /** Размер модального окна */
  size?: ModalBaseSize
  /** Визуальный тип подтверждающего действия */
  type: DialogConfirmType
  /** Основной текст сообщения */
  message: string
  /** Дополнительный текст под основным сообщением (второстепенный, светлый) */
  details?: string
  /** Заголовок диалога */
  title: string
  /** Текст основной кнопки (подтверждение действия) */
  labelPrimaryButton?: string
  /** Текст альтернативной кнопки (отмена) */
  labelSecondaryButton?: string
  /** Ставит автофокус на кнопку отмены при открытии */
  autoFocusCancelButton?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

// Модификатор корня по типу диалога: DialogConfirm_type_delete и т. д.
const rootClasses = computed(() => ['DialogConfirm', `DialogConfirm_type_${type}`].join(' '))

// Вид основной кнопки по типу диалога. У диалога ошибки основная кнопка — повтор действия
// (например, «Повторить»), она необязательна: без labelPrimaryButton остаётся только закрытие.
const PRIMARY_BUTTON_VARIANT: Record<DialogConfirmType, ButtonProps['variant']> = {
  confirm: 'accent',
  delete: 'danger',
  error: 'accent',
}

const primaryButtonVariant = computed(() => PRIMARY_BUTTON_VARIANT[type])

// У диалога ошибки по макету «StatusAlert» кнопка закрытия красная и стоит справа от «Повторить».
const isError = computed(() => type === 'error')
const hasRetryButton = computed(() => isError.value && labelPrimaryButton !== undefined)
const secondaryButtonVariant = computed<ButtonProps['variant']>(() => (isError.value ? 'danger' : 'page'))

// Вид заголовка по типу диалога: удаление и ошибка — красным.
const TITLE_VARIANT: Record<DialogConfirmType, ModalBaseTitleVariant> = {
  confirm: 'default',
  delete: 'danger',
  error: 'danger',
}

const titleVariant = computed(() => TITLE_VARIANT[type])

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
    :titleVariant="titleVariant"
    titleSize="m"
    :open="open"
    :rootClass="rootClasses"
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
      <ButtonBase v-if="hasRetryButton" :variant="primaryButtonVariant" @click="emit('confirm')">{{
        labelPrimaryButton
      }}</ButtonBase>

      <ButtonBase :variant="secondaryButtonVariant" v-autofocus="autoFocusCancelButton" @click="handleCancel">{{
        labelSecondaryButton
      }}</ButtonBase>

      <ButtonBase v-if="!isError" :variant="primaryButtonVariant" @click="emit('confirm')">{{
        labelPrimaryButton ?? 'Action'
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
