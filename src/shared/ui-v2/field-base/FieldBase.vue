<script setup lang="ts">
import type { MaskOptions } from 'maska'
import { vMaska } from 'maska/vue'
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useLocale } from '@/shared/i18n'
import { IconClose, IconDangerCircle, IconQuestion } from '@/shared/ui-v2/icons'
import FieldTooltip from './FieldTooltip.vue'

type Props = {
  /** Цветовой вариант поля. */
  variant?: 'default' | 'success' | 'error' | 'warning'
  /** Отключает ввод и взаимодействие с полем. */
  disabled?: boolean
  /** Разрешает чтение и выделение значения без изменения. */
  readonly?: boolean
  /** Состояние ошибки валидации */
  error?: boolean
  /** Сообщение об ошибке в тултипе. */
  errorMessage?: string
  /** Устаревший пропс: ошибки отображаются в тултипе без резервирования места. */
  reserveErrorSpace?: boolean
  /** Имя поля для формы */
  name: string
  /** Текстовая подпись поля */
  label?: string
  /** Текст информационной подсказки рядом с label */
  hint?: string
  /** Плейсхолдер для input */
  placeholder?: string
  /** Текущее значение поля */
  modelValue: string | null
  /** Задержка перед emit обновления значения */
  debounceMs?: number
  /** Маска ввода для `maska` */
  mask?: MaskOptions
  /** Максимальная длина вводимого значения */
  maxLength?: number
  /** Устаревший пропс, не применяется. Для класса корня используйте class. */
  rootClass?: string
}

const {
  label,
  hint,
  placeholder,
  name,
  modelValue,
  debounceMs = 400,
  mask,
  variant = 'default',
  error = false,
  errorMessage,
  maxLength,
  disabled = false,
  readonly = false,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'blur', value: string | null): void
}>()

const { t: translate } = useLocale()
const inputId = useId()
const controlRef = ref<HTMLElement | null>(null)
// Слушаем document: первый Tab может прийти с элемента вне поля.
const keyboardNavigation = ref(false)
function handleNavigationKey(event: KeyboardEvent) {
  if (event.key === 'Tab') keyboardNavigation.value = true
}
function handlePointerDown() {
  keyboardNavigation.value = false
}
onMounted(() => {
  document.addEventListener('keydown', handleNavigationKey, true)
  document.addEventListener('pointerdown', handlePointerDown, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleNavigationKey, true)
  document.removeEventListener('pointerdown', handlePointerDown, true)
})

const inputFocused = ref(false)
const iconFocused = ref(false)
const iconHovered = ref(false)
const tooltipHovered = ref(false)
const tooltipDismissed = ref(false)
const hasErrorMessage = computed(() => error && Boolean(errorMessage))
const tooltipOpen = computed(
  () =>
    !tooltipDismissed.value &&
    (iconFocused.value || iconHovered.value || tooltipHovered.value || (hasErrorMessage.value && inputFocused.value)),
)
function showTooltip() {
  tooltipDismissed.value = false
}

function handleIconMouseEnter() {
  iconHovered.value = true
  showTooltip()
}

function handleIconFocus() {
  iconFocused.value = true
  showTooltip()
}

function handleInputFocus() {
  inputFocused.value = true
  showTooltip()
}

function handleInputBlur(event: Event) {
  inputFocused.value = false
  commitNow(event)
}
// Заполненность отражает ввод сразу, независимо от задержки обновления модели.
const currentValue = ref(modelValue)
watch(
  () => modelValue,
  (value) => {
    currentValue.value = value
  },
)
const hasValue = computed(() => Boolean(currentValue.value))
const clearButtonLabel = computed(() => translate('ui.common.clearField'))
const classList = computed(() => [
  `FieldBase_variant_${variant}`,
  {
    FieldBase_keyboardNavigation: keyboardNavigation.value,
    FieldBase_empty: !hasValue.value,
    FieldBase_filled: hasValue.value,
    FieldBase_error: error,
    FieldBase_disabled: disabled,
    FieldBase_readonly: readonly,
  },
])

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
  currentValue.value = next

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
  currentValue.value = next

  clearTimer() // важно: чтобы не было второго эмита после blur
  emit('update:modelValue', next)
  emit('blur', next)
}

function clearValue() {
  currentValue.value = null
  clearTimer()
  emit('update:modelValue', null)
  emit('blur', null)
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <label v-bind="$attrs" :for="inputId" class="FieldBase" :class="classList">
    <div class="FieldBase-Label u-typo-body-small-m">
      <span class="FieldBase-LabelText">{{ label }}</span>
    </div>

    <span ref="controlRef" class="FieldBase_Control" @keydown.esc="tooltipDismissed = true">
      <svg v-if="readonly && !disabled" class="FieldBase-ReadonlyBorder" aria-hidden="true" focusable="false">
        <rect width="100%" height="100%" rx="23.5" />
      </svg>
      <Transition name="field-icon">
        <button
          v-if="(hasErrorMessage || hint) && !disabled"
          class="FieldBase-Hint"
          @mouseenter="handleIconMouseEnter"
          @mouseleave="iconHovered = false"
          type="button"
          :aria-label="hasErrorMessage ? errorMessage : hint"
          :aria-describedby="hasErrorMessage ? `${inputId}-error` : undefined"
          @focus="handleIconFocus"
          @blur="iconFocused = false"
          @click="showTooltip"
        >
          <span class="FieldBase-HintIconSlot">
            <Transition name="field-icon">
              <IconDangerCircle v-if="hasErrorMessage" key="error" class="FieldBase-HintIcon" />
              <IconQuestion v-else key="hint" class="FieldBase-HintIcon" />
            </Transition>
          </span>
        </button>
      </Transition>
      <input
        :id="inputId"
        @input="scheduleEmit"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        :value="currentValue"
        v-maska="mask"
        class="FieldBase_Input u-typo-body-m"
        :name="name"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error && errorMessage ? `${inputId}-error` : undefined"
        :placeholder="placeholder"
        :maxlength="maxLength"
        autocomplete="off"
        :disabled="disabled"
        :readonly="readonly"
      />
      <Transition name="field-icon">
        <button
          v-if="hasValue && !disabled && !readonly"
          class="FieldBase_Clear"
          type="button"
          :disabled="disabled || readonly || !hasValue"
          :aria-label="clearButtonLabel"
          @mousedown.prevent
          @click="clearValue"
        >
          <IconClose />
        </button>
      </Transition>
      <FieldTooltip
        @mouseenter="tooltipHovered = true"
        @mouseleave="tooltipHovered = false"
        :open="tooltipOpen && !disabled && Boolean(hasErrorMessage || hint)"
        :error-message="hasErrorMessage ? errorMessage : undefined"
        :hint="hint"
        :anchor="controlRef"
      />
    </span>

    <span :id="`${inputId}-error`" class="FieldBase-AccessibleError" aria-live="polite">{{
      hasErrorMessage ? errorMessage : ''
    }}</span>
  </label>
</template>

<style scoped lang="scss">
.FieldBase {
  // Палитра. Варианты переопределяют эти переменные, не стили элементов.
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  --color-background-default: var(--white);
  --color-background-disabled: var(--neutral-100);

  --color-border-empty: var(--neutral-400);
  --color-border-empty-hover: var(--neutral-500);
  --color-border-empty-focus: var(--neutral-500);
  --color-border-empty-focus-tab: transparent;
  --color-border-empty-disabled: var(--neutral-100);

  --color-border-filled: var(--neutral-400);
  --color-border-filled-hover: var(--neutral-500);
  --color-border-filled-focus: var(--neutral-500);
  --color-border-filled-focus-tab: transparent;
  --color-border-filled-disabled: var(--neutral-100);

  --color-text-placeholder: var(--neutral-400);
  --color-text-placeholder-disabled: var(--neutral-400);

  --color-text-default: var(--neutral-900);
  --color-text-disabled: var(--neutral-500);

  --color-icons: var(--neutral-500);
  --color-icons-hover: var(--neutral-700);
  --color-icons-focus: var(--neutral-700);

  --box-shadow-icons-focus-tab: 0px 0px 0px 3px #5a636466;
  --box-shadow-input-focus-tab: 0px 0px 0px 3px #f5c96a99;

  --color-label-default: var(--neutral-900);
}

// Выбор палитры по заполненности. Ниже элементы используют только эти алиасы.
.FieldBase_empty {
  --field-border: var(--color-border-empty);
  --field-border-hover: var(--color-border-empty-hover);
  --field-border-focus: var(--color-border-empty-focus);
  --field-border-focus-tab: var(--color-border-empty-focus-tab);
  --field-border-disabled: var(--color-border-empty-disabled);
}

.FieldBase_filled {
  --field-border: var(--color-border-filled);
  --field-border-hover: var(--color-border-filled-hover);
  --field-border-focus: var(--color-border-filled-focus);
  --field-border-focus-tab: var(--color-border-filled-focus-tab);
  --field-border-disabled: var(--color-border-filled-disabled);
}

// default использует базовую палитру из .FieldBase.

.FieldBase_variant_success {
  // Рамка пустого поля.
  --color-border-empty: var(--green-300);
  --color-border-empty-hover: var(--green-400);
  --color-border-empty-focus: var(--green-400);
  --color-border-empty-focus-tab: transparent;

  // Рамка заполненного поля.
  --color-border-filled: var(--green-400);
  --color-border-filled-hover: var(--green-400);
  --color-border-filled-focus: var(--green-400);
  --color-border-filled-focus-tab: transparent;

  --color-icons: var(--green-300);
  --color-icons-hover: var(--green-400);
  --color-icons-focus: var(--green-400);

  --box-shadow-input-focus-tab: 0 0 0 3px #4a8c7a99;
  --box-shadow-icons-focus-tab: 0 0 0 3px #4a8c7a99;
}

.FieldBase_variant_warning {
  // Рамка пустого поля.
  --color-border-empty: var(--yellow-600);
  --color-border-empty-hover: var(--orange-400);
  --color-border-empty-focus: var(--orange-400);
  --color-border-empty-focus-tab: transparent;

  // Рамка заполненного поля.
  --color-border-filled: var(--orange-400);
  --color-border-filled-hover: var(--orange-400);
  --color-border-filled-focus: var(--orange-400);
  --color-border-filled-focus-tab: transparent;

  --color-icons: var(--yellow-600);
  --color-icons-hover: var(--orange-400);
  --color-icons-focus: var(--orange-400);

  --box-shadow-input-focus-tab: 0 0 0 3px #d49a4a99;
  --box-shadow-icons-focus-tab: 0 0 0 3px #d49a4a99;
}

// Ошибка валидации идёт после вариантов и имеет приоритет над их палитрой.
.FieldBase_variant_error,
.FieldBase_error {
  // Рамка пустого поля.
  --color-border-empty: var(--red-400);
  --color-border-empty-hover: var(--red-500);
  --color-border-empty-focus: var(--red-500);
  --color-border-empty-focus-tab: transparent;

  // Рамка заполненного поля.
  --color-border-filled: var(--red-500);
  --color-border-filled-hover: var(--red-500);
  --color-border-filled-focus: var(--red-500);
  --color-border-filled-focus-tab: transparent;

  // Подпись и иконки. Текст значения и placeholder наследуют базовую палитру.
  --color-icons: var(--red-400);
  --color-icons-hover: var(--red-500);
  --color-icons-focus: var(--red-500);

  // Тени применяются только при навигации через Tab.
  --box-shadow-input-focus-tab: 0 0 0 3px #c05a5a66;
  --box-shadow-icons-focus-tab: 0 0 0 3px #c05a5a66;
}

// Элементы и взаимодействие.

.FieldBase-Label {
  color: var(--color-label-default);
}

.FieldBase-LabelText {
  flex: 1 1 auto;
}

.FieldBase_Control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding-inline: 16px;
  background: var(--color-background-default);
  border: 1px solid var(--field-border);
  border-radius: 24px;

  transition:
    background-color var(--transition-color),
    border-color var(--transition-color),
    box-shadow var(--transition-color),
    color var(--transition-color);

  &:hover {
    border-color: var(--field-border-hover);
  }

  &:has(.FieldBase_Input:focus) {
    border-color: var(--field-border-focus);
  }

  .FieldBase_keyboardNavigation &:has(.FieldBase_Input:focus) {
    border-color: var(--field-border-focus-tab);
    box-shadow: var(--box-shadow-input-focus-tab);
  }
}

.FieldBase_Input {
  flex: 1;
  min-width: 0;
  width: 100%;
  min-height: 46px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-default);

  &::placeholder {
    color: var(--color-text-placeholder);
  }
}

.FieldBase-Hint,
.FieldBase_Clear {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-icons);
  transition: color var(--transition-color);
  cursor: pointer;
  &:hover {
    color: var(--color-icons-hover);
  }

  &:focus {
    outline: none;
    color: var(--color-icons-focus);
  }

  .FieldBase_keyboardNavigation &:focus {
    color: var(--color-icons-focus);
    box-shadow: var(--box-shadow-icons-focus-tab);
  }
}

.FieldBase-Hint {
  cursor: help;
}

.FieldBase_Clear {
  opacity: var(--clear-opacity, 0);
  transform: scale(var(--clear-scale, 0.85));
  pointer-events: var(--clear-pointer-events, none);
  transition:
    color var(--transition-color),
    opacity var(--transition-color),
    transform var(--transition-color);
}

.FieldBase_Control:hover,
.FieldBase_Control:focus-within {
  --clear-opacity: 1;
  --clear-scale: 1;
  --clear-pointer-events: auto;
}

.FieldBase-HintIconSlot {
  display: grid;
  width: 24px;
  height: 24px;
}

.FieldBase-HintIcon {
  grid-area: 1 / 1;
  width: 24px;
  height: 24px;
}

.field-icon-enter-active,
.field-icon-leave-active {
  transition:
    color var(--transition-color),
    opacity var(--transition-color),
    transform var(--transition-color);
}

.field-icon-enter-from,
.field-icon-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.field-icon-leave-active {
  pointer-events: none;
}

.FieldBase-AccessibleError {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

// Ограничения взаимодействия идут последними и имеют приоритет над hover/focus.
.FieldBase_readonly {
  // Палитра readonly переопределяет общие переменные элементов.
  --color-background-default: var(--neutral-100);
  --color-text-default: var(--neutral-600);
  --box-shadow-input-focus-tab: none;

  // Прозрачная рамка сохраняет размеры; SVG рисует штрихи поверх неё.
  --field-border: transparent;
  --field-border-hover: transparent;
  --field-border-focus: transparent;
  --field-border-focus-tab: transparent;

  --readonly-border-color: var(--neutral-400);
  --readonly-border-width: 1px;
  --readonly-border-dash: 2px;
  --readonly-border-gap: 2px;

  .FieldBase_Control {
    &:hover {
      --color-background-default: var(--neutral-200);
      --color-text-default: var(--neutral-900);
      --readonly-border-color: var(--neutral-500);
    }

    &:has(.FieldBase_Input:focus) {
      --color-background-default: var(--neutral-200);
      --color-text-default: var(--neutral-900);
      --readonly-border-color: var(--neutral-500);
    }
  }

  &.FieldBase_keyboardNavigation .FieldBase_Control:has(.FieldBase_Input:focus) {
    --readonly-border-width: 1.5px;
    --readonly-border-dash: 6px;
    --readonly-border-gap: 6px;
  }

  .FieldBase-ReadonlyBorder {
    // Абсолютный слой отсчитывается от внутреннего края рамки в 1px.
    position: absolute;
    top: -0.5px;
    left: -0.5px;
    width: calc(100% + 1px);
    height: calc(100% + 1px);
    overflow: visible;
    pointer-events: none;
    fill: none;
    stroke: var(--readonly-border-color);
    stroke-width: var(--readonly-border-width);
    stroke-dasharray: var(--readonly-border-dash) var(--readonly-border-gap);
    transition: stroke var(--transition-color);
  }

  .FieldBase_Input::placeholder {
    opacity: 1;
  }
}

.FieldBase_disabled {
  .FieldBase_Control {
    background: var(--color-background-disabled);
    border-color: var(--field-border-disabled);
    box-shadow: none;
    cursor: not-allowed;
  }

  .FieldBase_Input {
    color: var(--color-text-disabled);
    cursor: not-allowed;

    &::placeholder {
      color: var(--color-text-placeholder-disabled);
    }
  }
}
</style>
