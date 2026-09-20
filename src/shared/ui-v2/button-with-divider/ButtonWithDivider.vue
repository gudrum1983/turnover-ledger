<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from '../button-base/types'
import { IconGlobal } from '@/shared/ui-v2/icons'

const {
  size = 'l',
  disabled = false,
  firstValue,
  secondLabel,
  secondValue,
} = defineProps<
  Pick<ButtonProps, 'size' | 'disabled'> & {
    firstLabel: string
    secondLabel: string
    firstValue: string
    secondValue: string
  }
>()

const hasSecondString = computed(() => secondLabel || secondValue)
const isFull = computed(() => size === 'l')
const hasDivider = computed(() => isFull.value && hasSecondString.value)
</script>

<template>
  <button class="ButtonWithDivider" type="button" :disabled="disabled">
    <div class="ButtonWithDivider-Content">
      <IconGlobal v-if="!isFull" size="m" />

      <div class="ButtonWithDivider-Label">
        <span v-if="firstValue" class="u-typo-label-l u-uppercase"> {{ firstValue }} </span>
      </div>

      <div v-if="hasDivider" class="ButtonWithDivider-Divider" />

      <div v-if="hasSecondString && isFull" class="ButtonWithDivider-Label">
        <span class="u-typo-label-m"> {{ secondLabel }} : </span>
        <span class="u-typo-label-l u-uppercase"> {{ secondValue }} </span>
      </div>
    </div>
  </button>
</template>

<style scoped lang="scss">
.ButtonWithDivider {
  --btn-clr-border: var(--neutral-400);
  --btn-clr-border-hover: var(--neutral-500);
  --btn-clr-border-active: var(--neutral-600);
  --btn-clr-border-disabled: var(--neutral-200);
  --btn-clr-border-focus: transparent;

  --divider-clr: var(--neutral-500);

  --btn-clr-bg: transparent;
  --btn-clr-bg-disabled: var(--neutral-100);

  --label-clr-bg: var(--yellow-400);

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
  padding: 0 15px;

  background: var(--btn-clr-bg);
  border-color: var(--btn-clr-border);
  color: var(--btn-clr-text);

  &:hover {
    background: var(--btn-clr-bg-hover);
    border-color: var(--btn-clr-border-hover);
    --label-clr-bg: var(--yellow-500);
  }

  &:active {
    background: var(--btn-clr-bg-active);
    border-color: var(--btn-clr-border-active);
    --label-clr-bg: var(--yellow-600);
    transition-duration: var(--transition-duration-active);
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
    --label-clr-bg: var(--yellow-400);
  }

  &-Content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-Label {
    display: flex;
    gap: 4px;
    background: var(--label-clr-bg);
    border-radius: 9px;
    padding: 4px 6px;
    transition:
      background-color var(--transition-color),
      color var(--transition-color);
  }

  &-Divider {
    width: 2px;
    height: stretch;
    background: var(--divider-clr);
  }
}
</style>
