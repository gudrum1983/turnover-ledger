<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Sizes } from '@/shared/types'

export type BaseButtonGroupOption = {
  value: string
  label: string
  disabled?: boolean
}

type Props = {
  modelValue?: string
  options: BaseButtonGroupOption[]
  disabled?: boolean
  name?: string
  ariaLabel?: string
  fullWidth?: boolean
  size?: Sizes
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  name: '',
  ariaLabel: '',
  fullWidth: false,
  size: 'md',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const groupRef = ref<HTMLElement | null>(null)
const enabledOptions = computed(() => props.options.filter((option) => !option.disabled))

const selectedIndex = computed(() => props.options.findIndex((option) => option.value === props.modelValue))

const fallbackIndex = computed(() => {
  if (enabledOptions.value.length < 1) return -1
  const firstEnabledValue = enabledOptions.value[0]?.value
  return props.options.findIndex((option) => option.value === firstEnabledValue)
})

const isSelected = (value: string) => props.modelValue === value

const getTabIndex = (index: number, optionDisabled: boolean | undefined) => {
  if (props.disabled || optionDisabled) return -1
  const activeIndex = selectedIndex.value >= 0 ? selectedIndex.value : fallbackIndex.value
  return index === activeIndex ? 0 : -1
}

const selectOption = (value: string, optionDisabled = false) => {
  if (props.disabled || optionDisabled || value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}

const focusOptionByValue = (value: string) => {
  const button = groupRef.value?.querySelector<HTMLButtonElement>(`button[data-value="${value}"]`)
  button?.focus()
}

const handleArrowNavigation = (direction: 1 | -1) => {
  if (props.disabled || enabledOptions.value.length < 1) return

  const currentEnabledIndex = enabledOptions.value.findIndex((option) => option.value === props.modelValue)
  const startIndex = currentEnabledIndex >= 0 ? currentEnabledIndex : 0
  const nextIndex = (startIndex + direction + enabledOptions.value.length) % enabledOptions.value.length
  const nextOption = enabledOptions.value[nextIndex]
  if (!nextOption) return

  selectOption(nextOption.value, false)
  focusOptionByValue(nextOption.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      handleArrowNavigation(1)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      handleArrowNavigation(-1)
      break
    case 'Home': {
      event.preventDefault()
      const first = enabledOptions.value[0]
      if (!first) return
      selectOption(first.value, false)
      focusOptionByValue(first.value)
      break
    }
    case 'End': {
      event.preventDefault()
      const last = enabledOptions.value[enabledOptions.value.length - 1]
      if (!last) return
      selectOption(last.value, false)
      focusOptionByValue(last.value)
      break
    }
  }
}
</script>

<template>
  <div
    ref="groupRef"
    class="BaseButtonGroup"
    :class="{ BaseButtonGroup_fullWidth: fullWidth }"
    role="radiogroup"
    :aria-label="ariaLabel || name || 'button-group'"
    @keydown="handleKeydown"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      class="BaseButtonGroup_Button"
      :class="[{ BaseButtonGroup_Button_selected: isSelected(option.value) }, `BaseButtonGroup_Button_size_${size}`]"
      type="button"
      role="radio"
      :aria-checked="isSelected(option.value)"
      :tabindex="getTabIndex(index, option.disabled)"
      :disabled="disabled || option.disabled"
      :data-value="option.value"
      @click="selectOption(option.value, Boolean(option.disabled))"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.BaseButtonGroup {
  display: inline-flex;
  align-items: center;

  &_fullWidth {
    width: 100%;
    .BaseButtonGroup_Button {
      flex: 1 1 0;
    }
  }

  &_Button {
    /*var size */
    --button-padding-inline: 12px;
    --button-padding-block: 8px;
    --button-font-size: var(--font-medium-text-base);

    border: 1px solid var(--color-border-default);
    background: var(--color-background-surface);
    color: var(--color-text-default);
    font: var(--font-medium-text-base);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      border-color 0.15s ease;
    position: relative;

    height: fit-content;
    padding: var(--button-padding-block) var(--button-padding-inline);
    font: var(--button-font-size);

    &:not(:first-child) {
      margin-left: -1px;
    }

    &:first-child {
      border-radius: 6px 0 0 6px;
    }

    &:last-child {
      border-radius: 0 6px 6px 0;
    }

    &:only-child {
      border-radius: 6px;
    }

    &:hover:not(:disabled):not(.BaseButtonGroup_Button_selected) {
      background: var(--color-background-default-hovered);
    }

    &:active:not(:disabled):not(.BaseButtonGroup_Button_selected) {
      background: var(--color-background-default-pressed);
    }

    &:focus-visible {
      outline: -webkit-focus-ring-color auto 1px;
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--color-text-disabled);
      border-color: var(--color-border-disabled);
      background: var(--color-background-disabled);
    }

    &_selected {
      z-index: 1;
      border-color: var(--color-border-info);
      background: var(--color-background-info);
      color: var(--color-text-base);

      &:hover:not(:disabled) {
        background: var(--color-background-info-hovered);
      }

      &:active:not(:disabled) {
        background: var(--color-background-info-pressed);
      }
    }
  }

  &_Button_size {
    &_xs {
      --button-padding-block: 4px;
      --button-padding-inline: 8px;
      --button-gap: 8px;
      --button-font-size: var(--font-medium-text-sm);
    }

    &_sm {
      --button-padding-inline: 8px;
      --button-gap: 8px;
      --button-font-size: var(--font-medium-text-sm);
    }

    &_md {
      --button-padding-inline: 12px;
      --button-gap: 10px;
      --button-font-size: var(--font-medium-text-base);
    }

    &_lg {
      --button-padding-inline: 16px;
      --button-gap: 12px;
      --button-font-size: var(--font-medium-text-lg);
    }
  }
}
</style>
