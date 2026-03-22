<script setup lang="ts">
import type { Colors, HorizontalAlign, Sizes, Variants } from '../../types'
import { computed } from 'vue'

type ContentPosition = Exclude<HorizontalAlign, 'right'>
type TypeButton = 'button' | 'submit' | 'reset'

type Props = {
  color?: Colors
  variant?: Variants
  fullWidth?: boolean
  size?: Sizes
  type?: TypeButton
  disabled?: boolean
  isIconOnly?: boolean
  contentPosition?: ContentPosition
}

const {
  color = 'default',
  variant = 'filled',
  fullWidth = false,
  size = 'md',
  type = 'button',
  disabled = false,
  isIconOnly = false,
  contentPosition = 'center',
} = defineProps<Props>()

const classes = computed(() => [
  `ButtonBase_color_${color}`,
  `ButtonBase_variant_${variant}`,
  `ButtonBase_size_${size}`,
  `ButtonBase_align_${contentPosition}`,
  { ButtonBase_fullWidth: fullWidth, ButtonBase_iconOnly: isIconOnly },
])
</script>

<template>
  <button class="ButtonBase" :class="classes" :disabled="disabled" :type="type">
    <slot name="icon" />
    <slot v-if="!isIconOnly" />
    <slot name="end-icon" class="ButtonBase_endIcon" />
  </button>
</template>

<style scoped lang="scss">
.ButtonBase {
  /*var color fill*/
  --btn-fill-bg: var(--color-background-default);
  --btn-fill-bg-hover: var(--color-background-default-hovered);
  --btn-fill-bg-active: var(--color-background-default-pressed);
  --btn-fill-bg-disabled: var(--color-background-disabled);
  --btn-fill-clr-text: var(--color-text-default);
  --btn-fill-clr-text-disabled: var(--color-text-disabled);

  /*var color outline*/
  --btn-outline-bg: var(--color-background-surface);
  --btn-outline-bg-hover: var(--color-background-default-hovered);
  --btn-outline-bg-active: var(--color-background-default-pressed);
  --btn-outline-bg-disabled: var(--color-background-surface);
  --btn-outline-clr-text: var(--color-text-default);
  --btn-outline-clr-text-disabled: var(--color-text-disabled);
  --btn-outline-clr-border: var(--color-border-default);
  --btn-outline-clr-border-disabled: var(--color-border-disabled);

  /*var size */
  --button-padding-inline: 12px;
  --button-padding-block: 8px;
  --button-gap: 8px;
  --button-font-size: var(--font-medium-text-base);

  /*var algin */
  --button-algin-content: center;

  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: var(--button-algin-content);
  height: fit-content;
  padding: var(--button-padding-block) var(--button-padding-inline);
  gap: var(--button-gap);
  font: var(--button-font-size);

  &_align {
    &_center {
      --button-algin-content: center;
    }
    &_left {
      --button-algin-content: flex-start;
    }
    &_right {
      --button-algin-content: flex-end;
    }
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
  }
}

.ButtonBase_fullWidth {
  width: 100%;
}

.ButtonBase_size {
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

.ButtonBase_variant_filled {
  background: var(--btn-fill-bg);
  color: var(--btn-fill-clr-text);

  &:hover {
    background: var(--btn-fill-bg-hover);
  }

  &:active {
    background: var(--btn-fill-bg-active);
  }

  &:disabled {
    background: var(--btn-fill-bg-disabled);
    color: var(--btn-fill-clr-text-disabled);
  }
}

.ButtonBase_variant_outline {
  background: var(--btn-outline-bg);
  border-color: var(--btn-outline-clr-border);
  color: var(--btn-outline-clr-text);

  &:hover {
    background: var(--btn-outline-bg-hover);
  }

  &:active {
    background: var(--btn-outline-bg-active);
  }

  &:disabled {
    background: var(--btn-outline-bg-disabled);
    border-color: var(--btn-outline-clr-border-disabled);
    color: var(--btn-outline-clr-text-disabled);
  }
}

.ButtonBase_color {
  &_default {
    /*fill*/
    --btn-fill-bg: var(--color-background-default);
    --btn-fill-bg-hover: var(--color-background-default-hovered);
    --btn-fill-bg-active: var(--color-background-default-pressed);
    --btn-fill-clr-text: var(--color-text-default);
    /*outline*/
    --btn-outline-clr-border: var(--color-border-default);
    --btn-outline-clr-text: var(--color-text-default);
  }

  &_primary {
    /*fill*/
    --btn-fill-bg: var(--color-background-primary);
    --btn-fill-bg-hover: var(--color-background-primary-hovered);
    --btn-fill-bg-active: var(--color-background-primary-pressed);
    --btn-fill-clr-text: var(--color-text-base);
    /*outline*/
    --btn-outline-clr-border: var(--color-border-primary);
    --btn-outline-clr-text: var(--color-text-primary);
  }

  &_info {
    /*fill*/
    --btn-fill-bg: var(--color-background-info);
    --btn-fill-bg-hover: var(--color-background-info-hovered);
    --btn-fill-bg-active: var(--color-background-info-pressed);
    --btn-fill-clr-text: var(--color-text-base);
    /*outline*/
    --btn-outline-clr-border: var(--color-border-info);
    --btn-outline-clr-text: var(--color-text-info);
  }

  &_success {
    /*fill*/
    --btn-fill-bg: var(--color-background-success);
    --btn-fill-bg-hover: var(--color-background-success-hovered);
    --btn-fill-bg-active: var(--color-background-success-pressed);
    --btn-fill-clr-text: var(--color-text-base);
    /* outline */
    --btn-outline-clr-border: var(--color-border-success);
    --btn-outline-clr-text: var(--color-text-success);
  }

  &_warning {
    /*fill*/
    --btn-fill-bg: var(--color-background-warning);
    --btn-fill-bg-hover: var(--color-background-warning-hovered);
    --btn-fill-bg-active: var(--color-background-warning-pressed);
    --btn-fill-clr-text: var(--color-text-base);
    /* outline */
    --btn-outline-clr-border: var(--color-border-warning);
    --btn-outline-clr-text: var(--color-text-warning);
  }

  &_danger {
    /*fill*/
    --btn-fill-bg: var(--color-background-danger);
    --btn-fill-bg-hover: var(--color-background-danger-hovered);
    --btn-fill-bg-active: var(--color-background-danger-pressed);
    --btn-fill-clr-text: var(--color-text-base);
    /* outline */
    --btn-outline-clr-border: var(--color-border-danger);
    --btn-outline-clr-text: var(--color-text-danger);
  }
}
</style>
