<script setup lang="ts">
import { computed } from 'vue'
import { FieldBase } from '../field-base'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Подпись поля */
  label?: string
  /** Текст информационной подсказки */
  hint?: string
  /** Плейсхолдер для input */
  placeholder?: string
  /** Текущее значение поля */
  modelValue: string | null
  /** Локаль: от неё зависят разделитель дробной части в маске и формат значения после blur */
  locale?: Intl.LocalesArgument
  /** Состояние ошибки валидации */
  error?: boolean
  /** Сообщение об ошибке в тултипе */
  errorMessage?: string
  /** Отключает ввод */
  disabled?: boolean
}

const {
  name,
  label,
  hint,
  placeholder,
  modelValue,
  locale = 'ru-RU',
  error = false,
  errorMessage,
  disabled = false,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'blur', value: string | null): void
}>()

// Разделитель дробной части локали: «,» для ru-RU и sr-RS, «.» для en-US.
const decimalSeparator = computed(() => {
  const decimalPart = new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')

  return decimalPart?.value ?? ','
})

// Маска: целая часть любой длины, разделитель и до двух знаков после него.
const moneyMask = computed(() => ({
  mask: `0${decimalSeparator.value}99`,
  tokens: {
    '0': { pattern: /[0-9]/, multiple: true },
    '9': { pattern: /[0-9]/, optional: true },
  },
}))

// После ухода из поля приводим значение к двум знакам после разделителя, без разделителей разрядов: «1200» → «1200,00».
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
  const formatted = formatMoneyValue(value)
  emit('update:modelValue', formatted)
  emit('blur', formatted)
}
</script>

<template>
  <FieldBase
    class="FieldMoney"
    :name="name"
    :label="label"
    :hint="hint"
    :placeholder="placeholder"
    :model-value="modelValue"
    :mask="moneyMask"
    :error="error"
    :error-message="errorMessage"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
    @blur="handleBlur"
  />
</template>
