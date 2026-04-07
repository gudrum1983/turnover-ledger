<script setup lang="ts">
import { computed } from 'vue'
import { FieldBase } from '@/shared/ui/field-base'

type Props = {
  name: string
  label?: string
  placeholder?: string
  modelValue: string | null
  locale?: Intl.LocalesArgument
}

const { name, label, placeholder, modelValue, locale = 'ru-RU' } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const decimalSeparator = computed(() => {
  const decimalPart = new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')

  return decimalPart?.value ?? ','
})

const moneyMask = computed(() => ({
  mask: `0${decimalSeparator.value}99`,
  tokens: {
    '0': { pattern: /[0-9]/, multiple: true },
    '9': { pattern: /[0-9]/, optional: true },
  },
}))

function formatMoneyValue(value: string | null): string | null {
  if (!value) return value

  const normalized = value.replace(',', '.')
  const parsed = Number(normalized)

  if (Number.isNaN(parsed)) return value

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(parsed)
}

function handleBlur(value: string | null) {
  emit('update:modelValue', formatMoneyValue(value))
}
</script>

<template>
  <FieldBase
    class="FieldMoney"
    :name="name"
    :label="label"
    :placeholder="placeholder"
    :model-value="modelValue"
    :mask="moneyMask"
    @update:modelValue="emit('update:modelValue', $event)"
    @blur="handleBlur"
  />
</template>
