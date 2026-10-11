<script setup lang="ts">
import { FieldBase } from '../field-base'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Подпись поля */
  label?: string
  /** Текст информационной подсказки рядом с label */
  hint?: string
  /** Плейсхолдер для input */
  placeholder?: string
  error?: boolean
  errorMessage?: string
  /** Сохраняет место под сообщение ошибки. */
  reserveErrorSpace?: boolean
  /** Максимальная длина вводимого значения. */
  maxLength?: number
  /** Текущее значение поля */
  modelValue: string | null
}

const { name, label, hint, placeholder, modelValue, error, errorMessage, reserveErrorSpace, maxLength } =
  defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'blur', value: string | null): void
}>()

const digitsMask = {
  mask: '0',
  tokens: {
    '0': { pattern: /[0-9]/, multiple: true },
  },
}
</script>

<template>
  <FieldBase
    rootClass="FieldDigit"
    :name="name"
    :label="label"
    :hint="hint"
    :placeholder="placeholder"
    :error="error"
    :error-message="errorMessage"
    :reserve-error-space="reserveErrorSpace"
    :max-length="maxLength"
    :model-value="modelValue"
    :mask="digitsMask"
    inputmode="numeric"
    @update:modelValue="emit('update:modelValue', $event)"
    @blur="emit('blur', $event)"
  />
</template>
