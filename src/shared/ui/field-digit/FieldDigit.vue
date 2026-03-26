<script setup lang="ts">
import { FieldBase } from '../field-base'

type Props = {
  name: string
  label?: string
  placeholder?: string
  modelValue: string | null
}

const { name, label, placeholder, modelValue } = defineProps<Props>()

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
    class="FieldDigit"
    :name="name"
    :label="label"
    :placeholder="placeholder"
    :model-value="modelValue"
    :mask="digitsMask"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
