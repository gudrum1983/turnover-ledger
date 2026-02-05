<script setup lang="ts">
import BaseField from '@/shared/ui/forms/BaseField.vue'

type Props = {
  name: string
  label?: string
  placeholder?: string
  modelValue: string | null
  fullWidth?: boolean
}

const { name, label, placeholder, modelValue, fullWidth = false } = defineProps<Props>()

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
  <BaseField
    :name="name"
    :label="label"
    :placeholder="placeholder"
    :model-value="modelValue"
    :full-width="fullWidth"
    :mask="digitsMask"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
