<script setup lang="ts">
import { computed, useSlots } from 'vue'

import { LoaderBase } from '@/shared/ui/loader-base'

type Props = {
  /** Основной цвет кнопки */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Визуальный вариант отображения */
  variant?: 'filled' | 'outlined'
  /** Растягивает кнопку на всю ширину контейнера */
  fullWidth?: boolean
  /** Размер кнопки */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** HTML-тип кнопки */
  type?: 'button' | 'submit' | 'reset'
  /** Отключает взаимодействие с кнопкой */
  disabled?: boolean
  /** Отображает только иконку без текстового содержимого */
  isIconOnly?: boolean
  /** Выравнивание содержимого внутри кнопки */
  contentPosition?: 'left' | 'center'
  /** Отображение иконки загрузки */
  isLoader?: boolean
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
  isLoader = false,
} = defineProps<Props>()

const classes = computed(() => [
  `ButtonBase_color_${color}`,
  `ButtonBase_variant_${variant}`,
  `ButtonBase_size_${size}`,
  `ButtonBase_align_${contentPosition}`,
  { ButtonBase_fullWidth: fullWidth, ButtonBase_iconOnly: isIconOnly },
])

const slots = useSlots()

const hasIconSlot = computed(() => Boolean(slots.icon))
const hasLabelSlot = computed(() => Boolean(slots.default))
</script>

<template>
  <button class="ButtonBase" :class="classes" :disabled="disabled" :type="type" :aria-busy="isLoader || undefined">
    <span class="ButtonBase_Content" :class="{ ButtonBase_Content_hidden: isLoader }">
      <span v-if="hasIconSlot" class="ButtonBase_Icon">
        <slot name="icon" />
      </span>
      <slot v-if="!isIconOnly && hasLabelSlot" />
      <span v-if="$slots['end-icon']" class="ButtonBase_EndIcon">
        <slot name="end-icon" />
      </span>
    </span>
    <span v-if="isLoader" class="ButtonBase_Loader" aria-hidden="true">
      <LoaderBase :size="size" />
    </span>
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
  position: relative;
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

.ButtonBase_Icon,
.ButtonBase_EndIcon,
.ButtonBase_Content {
  display: inline-flex;
  align-items: center;
}

.ButtonBase_Content {
  gap: inherit;
}

.ButtonBase_Content_hidden {
  visibility: hidden;
}

.ButtonBase_Loader {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
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

.ButtonBase_variant_outlined {
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
