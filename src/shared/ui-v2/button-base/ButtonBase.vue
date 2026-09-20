<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps, ButtonSize } from './types'

const {
  variant = 'page',
  fullWidth = false,
  size = 'desktop',
  type = 'button',
  disabled = false,
} = defineProps<ButtonProps>()

const BUTTON_SIZES = {
  desktop: { typography: 'L' },
  mobile: { typography: 'M' },
} as const satisfies Record<ButtonSize, { typography: string }>

const sizeConfig = computed(() => BUTTON_SIZES[size])
const classes = computed(() => [`ButtonBase_variant_${variant}`, { ButtonBase_fullWidth: fullWidth }])
const labelClasses = computed(() => ['Text_Uppercase', `Typo_Button${sizeConfig.value.typography}`])
</script>

<template>
  <button class="ButtonBase" :class="classes" :type="type" :disabled="disabled">
    <slot name="content" :label-classes="labelClasses">
      <span :class="labelClasses"><slot /></span>
    </slot>
  </button>
</template>

<style scoped lang="scss">
.ButtonBase {
  --btn-clr-border: var(--neutral-400);
  --btn-clr-border-hover: var(--neutral-500);
  --btn-clr-border-active: var(--neutral-600);
  --btn-clr-border-disabled: var(--neutral-200);
  --btn-clr-border-focus: transparent;

  --btn-clr-bg: var(--white);
  --btn-clr-bg-hover: var(--neutral-100);
  --btn-clr-bg-active: var(--neutral-200);
  --btn-clr-bg-disabled: var(--neutral-100);
  --btn-clr-bg-focus: var(--white);

  --btn-clr-text: var(--neutral-900);
  --btn-clr-text-disabled: var(--neutral-400);

  --btn-shadow-color: var(--neutral-400);
  --btn-shadow-opacity: 40%;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  gap: 8px;

  width: auto;
  min-height: 48px;
  border-radius: 24px;
  border-width: 1px;
  border-style: solid;
  padding: 0 23px;

  background: var(--btn-clr-bg);
  border-color: var(--btn-clr-border);
  color: var(--btn-clr-text);

  &:hover {
    background: var(--btn-clr-bg-hover);
    border-color: var(--btn-clr-border-hover);
  }

  &:active {
    background: var(--btn-clr-bg-active);
    border-color: var(--btn-clr-border-active);
  }

  &:disabled {
    background: var(--btn-clr-bg-disabled);
    border-color: var(--btn-clr-border-disabled);
    color: var(--btn-clr-text-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus-visible {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-shadow-color) var(--btn-shadow-opacity), transparent);
  }
}

.ButtonBase_fullWidth {
  width: 100%;
}

.ButtonBase_variant {
  &_page {
    --btn-clr-border: var(--neutral-400);
    --btn-clr-border-hover: var(--neutral-500);
    --btn-clr-border-active: var(--neutral-600);
    --btn-clr-border-disabled: var(--neutral-200);
    --btn-clr-border-focus: transparent;

    --btn-clr-bg: var(--white);
    --btn-clr-bg-hover: var(--neutral-100);
    --btn-clr-bg-active: var(--neutral-200);
    --btn-clr-bg-disabled: var(--neutral-100);
    --btn-clr-bg-focus: var(--white);

    --btn-clr-text: var(--neutral-900);
  }

  &_success {
    --btn-clr-border: var(--green-400);
    --btn-clr-border-hover: var(--green-400);
    --btn-clr-border-active: var(--green-400);

    --btn-clr-bg-hover: var(--green-100);
    --btn-clr-bg-active: var(--green-200);
    --btn-clr-bg-focus: var(--green-100);

    --btn-clr-text: var(--green-400);

    --btn-shadow-color: var(--green-400);
  }

  &_danger {
    --btn-clr-border: var(--red-500);
    --btn-clr-border-hover: var(--red-500);
    --btn-clr-border-active: var(--red-500);

    --btn-clr-bg: var(--red-100);
    --btn-clr-bg-hover: var(--red-200);
    --btn-clr-bg-active: var(--red-300);
    --btn-clr-bg-focus: var(--red-200);

    --btn-clr-text: var(--red-500);
    --btn-shadow-color: var(--red-500);
  }

  &_accent {
    --btn-clr-border: transparent;
    --btn-clr-border-hover: transparent;
    --btn-clr-border-active: transparent;
    --btn-clr-border-focus: var(--yellow-600);

    --btn-clr-bg: var(--yellow-400);
    --btn-clr-bg-hover: var(--yellow-500);
    --btn-clr-bg-active: var(--yellow-600);
    --btn-clr-bg-focus: var(--yellow-400);

    --btn-shadow-color: var(--yellow-600);
    --btn-shadow-opacity: 60%;
  }

  &_card {
    --btn-clr-border: transparent;
    --btn-clr-border-hover: transparent;
    --btn-clr-border-active: transparent;
  }
}
</style>
