<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  formatMoneyInput,
  getDecimalSeparator,
  groupMoneyInput,
  normalizeMoneyInput,
  parseMoneyInput,
} from '@/shared/lib'
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
  /** Локаль: от неё зависят разделители дробной части и разрядов */
  locale?: Intl.LocalesArgument
  /** Состояние ошибки валидации */
  error?: boolean
  /** Сообщение об ошибке в тултипе */
  errorMessage?: string
  /** Отключает ввод */
  disabled?: boolean
  /** Только для чтения: значение видно и выделяется, но не меняется (например, расчётные суммы) */
  readonly?: boolean
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
  readonly = false,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'blur', value: string | null): void
}>()

// Разделитель дробной части локали: «,» для ru-RU и sr-RS, «.» для en-US.
const decimalSeparator = computed(() => getDecimalSeparator(locale))

// Пока поле в фокусе, разрядов нет — курсор не прыгает при наборе. Вне фокуса — «1 200,50» по локали.
const inputFocused = ref(false)

// Маска: целая часть любой длины, разделитель и до двух знаков после него.
// До маски убираем разряды и заменяем «.» и «,» на разделитель локали: на телефоне клавиатура decimal
// показывает разделитель системной локали, а не локали интерфейса. После маски вне фокуса — разряды.
// Маска применяется заново при каждой перерисовке, поэтому значение с разрядами должно проходить через неё без изменений.
// Фокус читаем здесь, а не внутри postProcess: так маска пересоздаётся при фокусе и уходе из поля,
// maska сразу применяет её к значению — разряды убираются при фокусе, а не с первым введённым символом.
const moneyMask = computed(() => {
  const focused = inputFocused.value

  return {
    mask: `0${decimalSeparator.value}99`,
    preProcess: (value: string) => normalizeMoneyInput(value, locale),
    postProcess: (value: string) => (focused ? value : groupMoneyInput(value, locale)),
    tokens: {
      '0': { pattern: /[0-9]/, multiple: true },
      '9': { pattern: /[0-9]/, optional: true },
    },
  }
})

// После ухода из поля — два знака после разделителя и разряды: «1200» → «1 200,00».
function formatMoneyValue(value: string | null): string | null {
  if (!value) return value

  return formatMoneyInput(parseMoneyInput(value, locale), locale)
}

// Фокус именно на самом поле ввода, а не на значке подсказки рядом.
function handleFocusChange(event: FocusEvent, focused: boolean) {
  if (event.target instanceof HTMLInputElement) inputFocused.value = focused
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
    inputmode="decimal"
    :error="error"
    :error-message="errorMessage"
    :disabled="disabled"
    :readonly="readonly"
    @update:model-value="emit('update:modelValue', $event)"
    @blur="handleBlur"
    @focusin="handleFocusChange($event, true)"
    @focusout="handleFocusChange($event, false)"
  />
</template>
