<script setup lang="ts">
import BaseField from '@/shared/ui/BaseField.vue'

type Props = {
  name: string
  label?: string
  placeholder?: string
  modelValue: string | null
  fullWidth?: boolean
}

const { name, label, placeholder, modelValue, fullWidth = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const moneyMask = {
  mask: '0,99',
  tokens: {
    '0': { pattern: /[0-9]/, multiple: true },
    '9': { pattern: /[0-9]/, optional: true },
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
    :mask="moneyMask"
    @update:modelValue="emit('update:modelValue', $event)"
  />

  <!--  35 + @update:modelValue="emit('update:modelValue', $event == null ? null : String($event))"-->
  <!--или  15+   (e: 'update:modelValue', value: string | number | null): void-->
</template>
