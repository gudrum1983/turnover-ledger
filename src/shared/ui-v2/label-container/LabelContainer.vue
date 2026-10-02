<script setup lang="ts">
type LabelContainerProps = {
  /** Выбранное значение. При отсутствии совпадения все кнопки отображаются без выбора. */
  modelValue?: string
  /** Варианты выбора с уникальными значениями. Количество вариантов не ограничено. */
  options: readonly {
    /** Уникальное значение варианта, передаваемое в v-model и событиях выбора. */
    value: string
    /** Текст кнопки. */
    label: string
  }[]
  /** Доступное название группы кнопок для скринридеров. */
  ariaLabel: string
  /** Растягивает группу на всю ширину контейнера; кнопки делят ширину поровну. */
  fullWidth?: boolean
}

const { options, ariaLabel, modelValue = '', fullWidth = false } = defineProps<LabelContainerProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

function selectOption(value: string) {
  if (value === modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="LabelContainer" :class="{ LabelContainer_fullWidth: fullWidth }" role="group" :aria-label="ariaLabel">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="LabelContainer-Button u-typo-body-m"
      :class="{ 'LabelContainer-Button_selected': modelValue === option.value }"
      :aria-pressed="modelValue === option.value"
      @click="selectOption(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.LabelContainer {
  display: inline-flex;
  min-width: 0;
  gap: 1px;
  background: var(--neutral-200);
  border-radius: 24px;

  &_fullWidth {
    width: 100%;
  }
}

.LabelContainer-Button {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid var(--neutral-200);
  background: var(--white);
  color: var(--neutral-900);
  cursor: pointer;

  transition: background-color var(--transition-color);

  &:first-child {
    border-right: 0;
    border-radius: 24px 0 0 24px;
  }

  &:last-child {
    border-left: 0;
    border-radius: 0 24px 24px 0;
  }

  &:only-child {
    border: 1px solid var(--neutral-200);
    border-radius: 24px;
  }

  &:hover {
    background: var(--neutral-100);
  }

  &:active {
    background: var(--yellow-400);
    transition-duration: var(--transition-duration-active);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--neutral-400);
  }

  &_selected {
    background: var(--yellow-400);
  }

  &_selected:hover {
    background: var(--yellow-500);
  }

  &_selected:active {
    background: var(--yellow-600);
    transition-duration: var(--transition-duration-active);
  }

  &_selected:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--yellow-600);
  }
}
</style>
