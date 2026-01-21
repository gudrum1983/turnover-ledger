<script setup lang="ts">
import type { MaskOptions } from 'maska'
import { computed, onBeforeUnmount } from 'vue'

type TypeInput = 'text' | 'datalist'

type Props = {
  name: string
  label?: string
  fullWidth?: boolean
  type?: TypeInput
  placeholder?: string
  modelValue: string | null
  debounceMs?: number
  mask?: MaskOptions
  datalist?: string[]
}

const {
  label,
  placeholder,
  fullWidth = false,
  type = 'text',
  name,
  modelValue,
  debounceMs = 400,
  mask,
  datalist,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const isDatalist = computed(() => Array.isArray(datalist) && datalist.length > 0)
const datalistId = computed(() => `${name}list`)

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

function readValue(input: HTMLInputElement): string | null {
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
  <label class="BaseField Typo_Caption" v-if="!isDatalist">
    {{ label }}
    <input
      @input="scheduleEmit"
      @blur="commitNow"
      :value="modelValue"
      v-maska="mask"
      class="BaseField_Input"
      :class="classInput"
      :type="type"
      :name="name"
      :placeholder="placeholder"
    />
  </label>

  <label v-if="isDatalist" class="BaseField Typo_Caption">
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
      :list="datalistId"
    />

    <datalist :id="datalistId" v-if="isDatalist">
      <option v-for="item in datalist" :key="item" :value="item"></option>
    </datalist>
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
