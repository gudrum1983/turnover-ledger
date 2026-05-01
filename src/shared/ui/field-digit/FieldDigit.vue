<script setup lang="ts">
import { FieldBase } from '@/shared/ui/field-base'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Подпись поля */
  label?: string
  /** Текст информационной подсказки рядом с label */
  hint?: string
  /** Плейсхолдер для input */
  placeholder?: string
  /** Текущее значение поля */
  modelValue: string | null
}

const { name, label, hint, placeholder, modelValue } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
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
    :model-value="modelValue"
    :mask="digitsMask"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
