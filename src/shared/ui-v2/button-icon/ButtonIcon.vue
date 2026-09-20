<script setup lang="ts">
import { computed } from 'vue'
import type { IconSize } from '../icons/sizes'

type Props = {
  /** Визуальный вариант кнопки */
  variant?: 'page' | 'accent' | 'success' | 'danger' | 'card'
  /** Уменьшает видимую часть на 8 px, сохраняя область нажатия выбранного размера */
  touchTarget?: boolean
  /** Размер кнопки и области нажатия: m — 40 px, l — 48 px. */
  size?: 'm' | 'l'
  /** HTML-тип кнопки */
  type?: 'button' | 'submit' | 'reset'
  /** Отключает взаимодействие с кнопкой */
  disabled?: boolean
  /** Доступное название кнопки для программ экранного доступа */
  ariaLabel: string
}

const {
  variant = 'page',
  touchTarget = false,
  size = 'l',
  type = 'button',
  disabled = false,
  ariaLabel,
} = defineProps<Props>()

const ICON_SIZES = {
  regular: { dimension: 22, icon: 'l' },
  touch: { dimension: 18, icon: 'm' },
} as const satisfies Record<'regular' | 'touch', { dimension: number; icon: IconSize }>

const iconConfig = computed(() => ICON_SIZES[touchTarget ? 'touch' : 'regular'])
const BUTTON_SIZES = { m: 40, l: 48 } as const
const touchDimension = computed(() => `${BUTTON_SIZES[size]}px`)
const visualDimension = computed(() => `${BUTTON_SIZES[size] - (touchTarget ? 8 : 0)}px`)
const iconDimension = computed(() => `${iconConfig.value.dimension}px`)
</script>

<template>
  <button
    class="ButtonIcon"
    :class="`ButtonIcon_variant_${variant}`"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <span class="ButtonIcon-Surface" aria-hidden="true">
      <span class="ButtonIcon-Icon">
        <slot :size="iconConfig.icon" />
      </span>
    </span>
  </button>
</template>

<style scoped lang="scss">
.ButtonIcon {
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
  flex-shrink: 0;
  box-sizing: border-box;
  width: v-bind(touchDimension);
  height: v-bind(touchDimension);
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: transparent;
  color: var(--btn-clr-text);

  &:hover .ButtonIcon-Surface {
    background: var(--btn-clr-bg-hover);
    border-color: var(--btn-clr-border-hover);
  }

  &:active .ButtonIcon-Surface {
    background: var(--btn-clr-bg-active);
    border-color: var(--btn-clr-border-active);
  }

  &:disabled {
    color: var(--btn-clr-text-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  &:disabled .ButtonIcon-Surface {
    background: var(--btn-clr-bg-disabled);
    border-color: var(--btn-clr-border-disabled);
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .ButtonIcon-Surface {
    border-color: transparent;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-shadow-color) var(--btn-shadow-opacity), transparent);
  }
}

.ButtonIcon-Surface {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: v-bind(visualDimension);
  height: v-bind(visualDimension);
  border: 1px solid var(--btn-clr-border);
  border-radius: 50%;
  background: var(--btn-clr-bg);
}

.ButtonIcon-Icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: v-bind(iconDimension);
  height: v-bind(iconDimension);
}

.ButtonIcon_variant {
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
