<script setup lang="ts">
import type { MaskOptions } from 'maska'
import { vMaska } from 'maska/vue'
import { computed, onBeforeUnmount, useId } from 'vue'
import { useLocale } from '@/shared/i18n'
import { IconClose, IconDangerCircle, IconQuestion } from '@/shared/ui-v2/icons'
import { TooltipWrapper } from '@/shared/ui-v2/tooltip-wrapper'

type Props = {
  variant?: 'default' | 'card'
  disabled?: boolean
  readonly?: boolean
  /** Состояние ошибки валидации */
  error?: boolean
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
const hasValue = computed(() => Boolean(modelValue))
const clearButtonLabel = computed(() => translate('ui.common.clearField'))
const classList = computed(() => [
  `FieldBase_variant_${variant}`,
  { FieldBase_error: error },
  { FieldBase_filled: Boolean(modelValue) },
  { FieldBase_disabled: disabled },
  { FieldBase_readonly: readonly },
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
  <label v-bind="$attrs" :for="inputId" class="FieldBase" :class="classList">
    <div class="FieldBase-Label u-typo-body-small-m">
      <span class="FieldBase-LabelText">{{ label }}</span>
    </div>

    <span class="FieldBase_Control">
      <Transition name="field-icon">
        <TooltipWrapper v-if="hint && !disabled && !readonly" :text="hint">
          <button class="FieldBase-Hint" type="button" :aria-label="hint">
            <IconQuestion class="FieldBase-HintIcon" />
          </button>
        </TooltipWrapper>
      </Transition>
      <input
        :id="inputId"
        @input="scheduleEmit"
        @blur="commitNow"
        :value="modelValue"
        v-maska="mask"
        class="FieldBase_Input u-typo-body-m"
        :name="name"
        :aria-invalid="error ? 'true' : undefined"
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
    </span>

    <div class="FieldBase-ErrorText" v-if="error">
      <IconDangerCircle size="s" /> <span class="u-typo-body-small-m">Текст ошибки</span>
    </div>
  </label>
</template>

<style scoped lang="scss">
.FieldBase {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;

  --color-background-default: var(--white);
  --color-background-disabled: var(--neutral-100);

  --color-border-default: var(--neutral-400);
  --color-border-filled: var(--neutral-400);
  --color-border-hover: transparent;
  --color-border-focus: transparent;
  --color-border-error: var(--red-500);
  --color-border-disabled: var(--neutral-200);
  --color-border-readonly: var(--neutral-400);

  --box-shadow-default: 0 0 0 3px #c5cecf66;

  --box-shadow-icons-default: 0 0 0 3px #c5cecf66;
  --box-shadow-icons-error: 0 0 0 3px #c05a5a66;
  --box-shadow-icons-card: 0 0 0 3px #17202166;

  --color-label-default: var(--neutral-600);
  --color-label-error: var(--red-500);

  --color-text-default: var(--neutral-900);
  --color-text-disabled: var(--neutral-400);
  --color-text-placeholder: var(--neutral-500);
  --color-text-error: var(--red-500);

  --color-icons: var(--neutral-500);
  --color-icons-error: var(--red-500);
  --color-icons-hover: var(--neutral-700);
  --color-icons-disabled: var(--neutral-400);
}

.FieldBase-Label {
  color: var(--color-label-default);
}

.FieldBase_LabelText {
  flex: 1 1 auto;
}

.FieldBase_Control {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding-inline: 16px;
  background: var(--color-background-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;

  transition:
    background-color var(--transition-color),
    border-color var(--transition-color),
    box-shadow var(--transition-color),
    color var(--transition-color);

  &:hover {
    border-color: var(--color-border-hover);
    box-shadow: var(--box-shadow-default);
  }

  &:focus-within {
    border-color: var(--color-border-focus);
    box-shadow: var(--box-shadow-default);
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

.FieldBase-Hint {
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
  cursor: help;
  &:hover {
    color: var(--color-icons-hover);
    cursor: help;
  }

  &:focus-visible {
    outline: none;
    color: var(--color-icons-hover);
    box-shadow: var(--box-shadow-icons-default);
  }
}

.FieldBase-HintIcon {
  width: 24px;
  height: 24px;
}

.FieldBase_Clear {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-icons);
  cursor: pointer;
  transition: color var(--transition-color);
  border-radius: 50%;

  &:hover {
    color: var(--color-icons-hover);
  }

  &:focus-visible {
    outline: none;
    color: var(--color-icons-hover);
    box-shadow: var(--box-shadow-icons-default);
  }
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

.FieldBase-ErrorText {
  display: flex;
  align-items: center;
  gap: 4px;
}

.FieldBase_error {
  .FieldBase-Label,
  .FieldBase-ErrorText {
    color: var(--color-text-error);
  }

  .FieldBase_Control {
    border-color: var(--color-border-error);
  }

  .FieldBase-Hint,
  .FieldBase_Clear {
    color: var(--color-icons-error);

    &:focus-visible {
      box-shadow: var(--box-shadow-icons-error);
    }
  }
}

.FieldBase_disabled {
  .FieldBase_Control {
    border-color: var(--color-border-disabled);
    background-color: var(--color-background-disabled);
    cursor: not-allowed;
    &:hover {
      box-shadow: none;
    }
  }

  .FieldBase_Input {
    color: var(--color-text-disabled);
    cursor: not-allowed;
  }
}

.FieldBase_readonly {
  .FieldBase_Control {
    border-color: var(--color-border-readonly);
    background-color: var(--color-background-disabled);
    cursor: default;
    &:hover {
      box-shadow: none;
    }
    &:focus-within {
      box-shadow: none;
    }
  }

  .FieldBase_Input {
    cursor: default;
  }
}

.FieldBase_variant_card {
  --color-label-default: var(--neutral-900);
  --color-icons: var(--neutral-600);
  --color-icons-hover: var(--neutral-900);
  --box-shadow-icons-default: var(--box-shadow-icons-card);
}
</style>
