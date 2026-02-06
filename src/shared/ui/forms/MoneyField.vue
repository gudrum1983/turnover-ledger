<script setup lang="ts">
import { computed } from 'vue'
import BaseField from './BaseField.vue'
import { useLocaleStore } from '@/app/stores/localeStore.ts'

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

const localeStore = useLocaleStore()

const decimalSeparator = computed(() => (localeStore.currentLocale === 'en' ? '.' : ','))

const moneyMask = computed(() => ({
  mask: `0${decimalSeparator.value}99`,
  tokens: {
    '0': { pattern: /[0-9]/, multiple: true },
    '9': { pattern: /[0-9]/, optional: true },
  },
}))
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
</template>
