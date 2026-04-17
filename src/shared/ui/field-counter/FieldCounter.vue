<script setup lang="ts">
import { computed } from 'vue'
import { FieldBase } from '@/shared/ui/field-base'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Базовая подпись поля */
  label?: string
  /** Текст информационной подсказки рядом с label */
  hint?: string
  /** Плейсхолдер для input */
  placeholder?: string
  /** Текущее значение поля */
  modelValue: string | null
  /** Задержка перед emit обновления значения */
  debounceMs?: number
  /** Максимальное число символов */
  maxLength: number
}

const { name, label, hint, placeholder, modelValue, debounceMs = 0, maxLength } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const currentLength = computed(() => modelValue?.length ?? 0)
</script>

<template>
  <FieldBase
    rootClass="FieldCounter"
    :name="name"
    :label="label ? `${label} (${currentLength}/${maxLength})` : ''"
    :hint="hint"
    :placeholder="placeholder"
    :model-value="modelValue"
    :debounce-ms="debounceMs"
    :max-length="maxLength"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

<style scoped lang="scss">
.FieldCounter {
  width: 100%;
}
</style>
