<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'

type TypeInput = 'text' | 'number'

type Props = {
  name: string
  label?: string
  fullWidth?: boolean
  type?: TypeInput
  placeholder?: string
  modelValue: string | number | null
  debounceMs?: number
}

const {
  label,
  placeholder,
  fullWidth = false,
  type = 'text',
  name,
  modelValue,
  debounceMs = 400,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const classInput = computed(() => [{ BaseButton_fullWidth: fullWidth }])

let t: number | null = null

function clearTimer() {
  if (t !== null) {
    window.clearTimeout(t)
    t = null
  }
}

function scheduleEmit(e: Event) {
  const input = e.target as HTMLInputElement
  const next = readValue(input)

  clearTimer()
  t = window.setTimeout(() => {
    emit('update:modelValue', next)
    t = null
  }, debounceMs)
}

function readValue(input: HTMLInputElement): string | number | null {
  if (type === 'number') {
    return Number.isNaN(input.valueAsNumber) ? null : input.valueAsNumber
  }
  return input.value
}

function commitNow(e: Event) {
  const input = e.target as HTMLInputElement
  const next = readValue(input)

  clearTimer() // важно: чтобы не было второго эмита после blur
  emit('update:modelValue', next)
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <label class="BaseField Typo_Caption">
    {{ label }}
    <input
      @input="scheduleEmit"
      @blur="commitNow"
      :value="modelValue"
      class="BaseField_Input"
      :class="classInput"
      :type="type"
      :name="name"
      :placeholder="placeholder"
    />
  </label>
</template>

<style scoped lang="scss">
.BaseField {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.BaseField_Input {
  padding: 8px 12px;
  background: var(--color-background-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 4px;
  color: var(--color-text-default);

  &:hover {
    border-color: var(--color-border-primary);
  }

  &::placeholder {
    color: var(--color-text-placeholder);
  }
}
</style>
