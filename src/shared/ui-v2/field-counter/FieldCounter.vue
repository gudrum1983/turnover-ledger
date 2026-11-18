<script setup lang="ts">
import { computed } from 'vue'
import { FieldBase } from '../field-base'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Подпись поля. К ней добавляется счётчик: «Описание (12/55)». */
  label?: string
  /** Текст информационной подсказки */
  hint?: string
  /** Плейсхолдер для input */
  placeholder?: string
  /** Текущее значение поля */
  modelValue: string | null
  /** Максимальное число символов: лишнее при вводе отрезается. */
  maxLength: number
  /** Задержка перед emit обновления значения. По умолчанию 0 — иначе счётчик отстаёт от ввода. */
  debounceMs?: number
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
  maxLength,
  debounceMs = 0,
  error = false,
  errorMessage,
  disabled = false,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'blur', value: string | null): void
}>()

const currentLength = computed(() => modelValue?.length ?? 0)
const labelWithCounter = computed(() => (label ? `${label} (${currentLength.value}/${maxLength})` : ''))
</script>

<template>
  <FieldBase
    class="FieldCounter"
    :name="name"
    :label="labelWithCounter"
    :hint="hint"
    :placeholder="placeholder"
    :model-value="modelValue"
    :debounce-ms="debounceMs"
    :max-length="maxLength"
    :error="error"
    :error-message="errorMessage"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
    @blur="emit('blur', $event)"
  />
</template>
