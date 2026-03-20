<script setup lang="ts">
import type { MaskOptions } from 'maska'
import { computed, onBeforeUnmount } from 'vue'
import { IconClose } from '../icons'

type TypeInput = 'text' | 'datalist' | 'date'

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
  maxLength?: number
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
  maxLength,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'blur', value: string | null): void
}>()

const isDatalist = computed(() => Array.isArray(datalist) && datalist.length > 0)
const datalistId = computed(() => `${name}list`)
const hasValue = computed(() => Boolean(modelValue))

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
  const nextValue = input.value

  if (typeof maxLength === 'number' && maxLength >= 0 && nextValue.length > maxLength) {
    const trimmed = nextValue.slice(0, maxLength)
    input.value = trimmed
    return trimmed
  }

  return nextValue
}

function commitNow(e: Event) {
  const input = e.target as HTMLInputElement
  const next = readValue(input)

  clearTimer() // важно: чтобы не было второго эмита после blur
  emit('update:modelValue', next)
  emit('blur', next)
}

function clearValue() {
  clearTimer()
  emit('update:modelValue', null)
  emit('blur', null)
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <label class="BaseField Typo_Caption" v-if="!isDatalist">
    {{ label }}
    <span class="BaseField_Control">
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
        :maxlength="maxLength"
      />
      <button
        v-if="hasValue"
        class="BaseField_Clear"
        type="button"
        aria-label="Clear field"
        @mousedown.prevent
        @click="clearValue"
      >
        <IconClose />
      </button>
    </span>
  </label>

  <label v-if="isDatalist" class="BaseField Typo_Caption">
    {{ label }}
    <span class="BaseField_Control">
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
        :maxlength="maxLength"
        autocomplete="off"
      />
      <button
        v-if="hasValue"
        class="BaseField_Clear"
        type="button"
        aria-label="Clear field"
        @mousedown.prevent
        @click="clearValue"
      >
        <IconClose />
      </button>
    </span>

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

.BaseField_Control {
  position: relative;
  display: flex;
  width: 100%;
}

.BaseField_Input {
  width: 100%;
  padding: 8px 36px 8px 12px;
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

.BaseField_Clear {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-placeholder);
  cursor: pointer;

  &:hover {
    color: var(--color-text-default);
  }
}
</style>
