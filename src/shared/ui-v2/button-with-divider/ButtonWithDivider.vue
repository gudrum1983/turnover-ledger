<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from '../button-base/types'
import { IconGlobal } from '@/shared/ui-v2/icons'

const {
  size = 'l',
  disabled = false,
  leftLabel,
  rightLabel,
  rightValue,
} = defineProps<
  Pick<ButtonProps, 'size' | 'disabled'> & {
    rightLabel: string
    leftLabel: string
    rightValue: string
  }
>()

const isLarge = computed(() => size === 'l')
</script>

<template>
  <button class="ButtonWithDivider" type="button" :disabled="disabled">
    <span class="ButtonWithDivider-Content">
      <IconGlobal v-if="!isLarge" size="m" />

      <span class="ButtonWithDivider-Label">
        <span class="u-typo-label-l u-uppercase"> {{ leftLabel }} </span>
      </span>

      <span v-if="isLarge" class="ButtonWithDivider-Divider" />

      <span v-if="isLarge" class="ButtonWithDivider-Label">
        <span class="u-typo-label-m"> {{ rightLabel }} : </span>
        <span class="u-typo-label-l u-uppercase"> {{ rightValue }} </span>
      </span>
    </span>
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
  --label-clr-bg-hover: var(--yellow-500);
  --label-clr-bg-active: var(--yellow-600);
  --label-clr-bg-focus: var(--yellow-400);

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

  transition:
    background-color var(--transition-color),
    border-color var(--transition-color);

  &:hover {
    border-color: var(--btn-clr-border-hover);

    .ButtonWithDivider-Label {
      background-color: var(--label-clr-bg-hover);
    }
  }

  &:active {
    border-color: var(--btn-clr-border-active);
    transition-duration: var(--transition-duration-active);

    .ButtonWithDivider-Label {
      background-color: var(--label-clr-bg-active);
    }
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

    .ButtonWithDivider-Label {
      background-color: var(--label-clr-bg-focus);
    }
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
