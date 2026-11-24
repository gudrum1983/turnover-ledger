<script setup lang="ts">
import { computed } from 'vue'
import { useTouchMode } from '@/shared/lib'
import { ICON_SIZES as ICON_DIMENSIONS, type IconSize } from '../icons/sizes'

type Props = {
  /** Визуальный вариант кнопки */
  variant?: 'page' | 'accent' | 'success' | 'danger' | 'card' | 'danger-card'
  /**
   * Сенсорный вид из макета («mobile touch»): видимая часть на 8 px меньше, область нажатия того же размера.
   * auto — включается сам, когда основное устройство ввода — палец (pointer: coarse);
   * true / false — принудительно для конкретного места.
   */
  touchTarget?: boolean | 'auto'
  /** Размер кнопки и области нажатия: m — 40 px, l — 48 px. */
  size?: 'm' | 'l'
  /** HTML-тип кнопки */
  type?: 'button' | 'submit' | 'reset'
  /** Отключает взаимодействие с кнопкой */
  disabled?: boolean
  /** Скрывает рамку во всех состояниях кнопки. */
  noBorder?: boolean
  /** Доступное название кнопки для программ экранного доступа */
  ariaLabel: string
}

const {
  variant = 'page',
  touchTarget = 'auto',
  size = 'l',
  type = 'button',
  disabled = false,
  noBorder = false,
  ariaLabel,
} = defineProps<Props>()

/** Размер иконки по размеру кнопки и режиму сенсорной области (из спецификации макета) */
const ICON_SIZES = {
  l: { regular: 'xl', touch: 'm' },
  m: { regular: 's', touch: 's' },
} as const satisfies Record<'m' | 'l', Record<'regular' | 'touch', IconSize>>

const touchMode = useTouchMode()
const isTouch = computed(() => (touchTarget === 'auto' ? touchMode.value : touchTarget))

const iconSize = computed<IconSize>(() => ICON_SIZES[size][isTouch.value ? 'touch' : 'regular'])
const BUTTON_SIZES = { m: 40, l: 48 } as const
const touchDimension = computed(() => `${BUTTON_SIZES[size]}px`)
const visualDimension = computed(() => `${BUTTON_SIZES[size] - (isTouch.value ? 8 : 0)}px`)
const iconDimension = computed(() => `${ICON_DIMENSIONS[iconSize.value].dimension}px`)
</script>

<template>
  <button
    class="ButtonIcon"
    :class="[`ButtonIcon_variant_${variant}`, { ButtonIcon_noBorder: noBorder }]"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <span class="ButtonIcon-Surface" aria-hidden="true">
      <span class="ButtonIcon-Icon">
        <slot :size="iconSize" />
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

  &:focus-visible {
    outline: none;
  }

  &:focus-visible .ButtonIcon-Surface {
    border-color: transparent;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-shadow-color) var(--btn-shadow-opacity), transparent);
  }

  &:active .ButtonIcon-Surface {
    background: var(--btn-clr-bg-active);
    border-color: var(--btn-clr-border-active);
    transition-duration: var(--transition-duration-active);
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

  &.ButtonIcon_noBorder .ButtonIcon-Surface {
    border-color: transparent;
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
  transition:
    background-color var(--transition-color),
    border-color var(--transition-color);
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
    --btn-clr-text: var(--neutral-600);

    --btn-clr-bg-hover: var(--neutral-200);
    --btn-clr-bg-active: var(--neutral-300);
    --btn-clr-bg-disabled: var(--neutral-100);
    --btn-clr-bg-focus: var(--white);

    --btn-clr-bg: transparent;
    --btn-clr-border: transparent;
    --btn-clr-border-hover: transparent;
    --btn-clr-border-active: transparent;

    &:hover {
      --btn-clr-text: var(--neutral-900);
    }

    &:focus-visible {
      --btn-clr-text: var(--neutral-900);
    }

    &:focus-visible {
      --btn-clr-text: var(--neutral-900);
    }

    &:active {
      --btn-clr-text: var(--neutral-900);
    }
  }

  &_danger-card {
    --btn-clr-border: transparent;
    --btn-clr-border-hover: transparent;
    --btn-clr-border-active: transparent;

    --btn-clr-bg: transparent;
    --btn-clr-bg-hover: var(--red-200);
    --btn-clr-bg-active: var(--red-300);
    --btn-clr-bg-focus: var(--red-200);

    --btn-clr-text: var(--red-500);
    --btn-shadow-color: var(--red-500);
  }
}
</style>
