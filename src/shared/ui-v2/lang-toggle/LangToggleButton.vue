<script setup lang="ts">
const {
  tag,
  label,
  selected = false,
} = defineProps<{
  tag: string
  label: string
  selected?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    class="LangToggleButton"
    :class="{ LangToggleButton_selected: selected }"
    :aria-pressed="selected"
    :disabled="selected"
    @click="emit('select')"
  >
    <span class="LangToggleButton-Label u-typo-label-l u-uppercase">{{ tag }}</span>
    <span class="u-typo-label-m">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.LangToggleButton {
  --btn-clr-bg: var(--white);
  --btn-clr-border: var(--neutral-100);
  --label-clr-bg: transparent;
  --label-clr-border: var(--neutral-100);

  --label-clr-bg-hover: var(--neutral-100);

  --btn-clr-border-focus: var(--white);
  --label-clr-bg-focus: var(--neutral-100);

  --btn-clr-border-active: var(--neutral-300);
  --btn-clr-bg-active: var(--neutral-300);
  --label-clr-bg-active: var(--neutral-100);
  --label-clr-border-active: var(--neutral-100);

  --btn-clr-border-selected: var(--neutral-300);
  --btn-clr-bg-selected: var(--neutral-300);
  --label-clr-bg-selected: var(--yellow-400);
  --label-clr-border-selected: var(--yellow-400);

  --btn-clr-bg-disabled: var(--neutral-100);
  --btn-clr-border-disabled: var(--neutral-100);
  --label-clr-bg-disabled: var(--neutral-100);
  --label-clr-border-disabled: var(--neutral-200);

  --btn-clr-text: var(--neutral-900);
  --btn-clr-text-disabled: var(--neutral-400);

  --btn-shadow-color: var(--neutral-400);
  --btn-shadow-opacity: 40%;

  cursor: pointer;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  gap: 4px;

  box-sizing: border-box;
  width: fit-content;
  min-height: 39px;
  border-radius: 100px;
  border-width: 1px;
  border-style: solid;
  padding: 7px 9px;

  background: var(--btn-clr-bg);
  border-color: var(--btn-clr-border);
  color: var(--btn-clr-text);

  transition:
    background-color var(--transition-color),
    border-color var(--transition-color);

  &:hover:not(:disabled) {
    .LangToggleButton-Label {
      background-color: var(--label-clr-bg-hover);
    }
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible:not(:disabled) {
    border-color: var(--btn-clr-border-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-shadow-color) var(--btn-shadow-opacity), transparent);

    .LangToggleButton-Label {
      background-color: var(--label-clr-bg-focus);
    }
  }

  &:active:not(:disabled) {
    border-color: var(--btn-clr-border-active);
    background-color: var(--btn-clr-bg-active);
    transition-duration: var(--transition-duration-active);

    .LangToggleButton-Label {
      background-color: var(--label-clr-bg-active);
      border-color: var(--label-clr-border-active);
    }
  }

  &-Label {
    box-sizing: border-box;
    display: flex;
    gap: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--label-clr-border);
    background: var(--label-clr-bg);
    border-radius: 9px;
    padding: 1px 3px;
    transition:
      background-color var(--transition-color),
      color var(--transition-color);
  }
}

.LangToggleButton_selected {
  background-color: var(--btn-clr-bg-selected);
  border-color: var(--btn-clr-border-selected);
  cursor: default;

  .LangToggleButton-Label {
    background-color: var(--label-clr-bg-selected);
    border-color: var(--label-clr-border-selected);
  }
}

.LangToggleButton_disabled {
  background: var(--btn-clr-bg-disabled);
  border-color: var(--btn-clr-border-disabled);
  color: var(--btn-clr-text-disabled);
  cursor: not-allowed;
  pointer-events: none;

  .LangToggleButton-Label {
    background-color: var(--label-clr-bg-disabled);
    border-color: var(--label-clr-border-disabled);
  }
}

.LangToggleButton_fullWidth {
  width: 100%;
}
</style>
