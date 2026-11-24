<script setup lang="ts">
type CheckboxBaseProps = {
  /** Отмечен ли чекбокс */
  modelValue: boolean
  /** Частичный выбор (например, «Все годы», когда отмечена часть годов). Важнее modelValue для отображения */
  indeterminate?: boolean
  /** Отключает чекбокс */
  disabled?: boolean
  /** Состояние ошибки */
  error?: boolean
  /** Приглушённый текст после подписи, например «(12 записей)» */
  description?: string
}

const {
  modelValue,
  indeterminate = false,
  disabled = false,
  error = false,
  description,
} = defineProps<CheckboxBaseProps>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label
    class="CheckboxBase u-typo-body-m"
    :class="{
      CheckboxBase_checked: modelValue || indeterminate,
      CheckboxBase_disabled: disabled,
      CheckboxBase_error: error && !disabled,
    }"
  >
    <input
      class="CheckboxBase-Input"
      type="checkbox"
      :checked="modelValue"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      @change="handleChange"
    />
    <!-- Значки из макета (12 × 12): цвет — currentColor, толщина линии — --checkbox-icon-stroke. -->
    <span class="CheckboxBase-Box" aria-hidden="true">
      <svg v-if="indeterminate" class="CheckboxBase-Icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6H9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-else-if="modelValue" class="CheckboxBase-Icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span class="CheckboxBase-Label">
      <slot />
      <span v-if="description" class="CheckboxBase-Description">{{ ' ' + description }}</span>
    </span>
  </label>
</template>

<style scoped lang="scss">
// Состояния по макету Figma «Checkboxes»: Default, Hover, Focused, Active, Disabled, Error
// для выключенного, включённого и смешанного (indeterminate) чекбокса.
.CheckboxBase {
  --checkbox-bg: var(--white);
  --checkbox-border: var(--blue-400);
  --checkbox-icon: var(--blue-400);
  --checkbox-icon-stroke: 1.5;

  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: var(--neutral-900);
  cursor: pointer;

  &-Input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  &-Box {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 1px solid var(--checkbox-border);
    border-radius: 4px;
    background: var(--checkbox-bg);
    color: var(--checkbox-icon);
    transition:
      background-color var(--transition-color),
      border-color var(--transition-color),
      box-shadow var(--transition-color);
  }

  &-Icon {
    display: block;
    flex-shrink: 0;

    path {
      stroke-width: var(--checkbox-icon-stroke);
    }
  }

  &-Description {
    color: var(--neutral-600);
  }

  &:hover {
    --checkbox-bg: var(--blue-100);
  }

  // Фокус с клавиатуры. У выключенного рамка светлее, у включённого и смешанного — как обычно.
  // :where — чтобы :has не поднимал специфичность выше, чем у ошибки.
  &:where(:has(.CheckboxBase-Input:focus-visible)) {
    --checkbox-bg: var(--blue-100);
    --checkbox-border: var(--blue-200);
  }

  &_checked:where(:has(.CheckboxBase-Input:focus-visible)) {
    --checkbox-border: var(--blue-400);
  }

  &-Input:focus-visible + &-Box {
    box-shadow: 0 0 0 3px #f5c96a99;
  }

  &:active {
    --checkbox-bg: var(--blue-200);
    --checkbox-border: var(--blue-400);

    .CheckboxBase-Box {
      transition-duration: var(--transition-duration-active);
    }
  }

  // Ошибка и отключённое состояние не меняются при наведении, фокусе и нажатии
  // (двойной класс — чтобы перебить :hover и :active).
  &.CheckboxBase_error {
    --checkbox-bg: var(--white);
    --checkbox-border: var(--red-400);
    --checkbox-icon: var(--red-400);
    --checkbox-icon-stroke: 2;
  }

  &.CheckboxBase_error.CheckboxBase_checked {
    --checkbox-bg: var(--red-100);
  }

  &.CheckboxBase_disabled {
    --checkbox-bg: var(--neutral-100);
    --checkbox-border: var(--neutral-300);
    --checkbox-icon: var(--neutral-300);
    --checkbox-icon-stroke: 2;

    color: var(--neutral-400);
    cursor: not-allowed;

    .CheckboxBase-Description {
      color: var(--neutral-400);
    }
  }
}
</style>
