<script setup lang="ts">
type Option = {
  value: string
  label: string
}

type Props = {
  options: Option[]
  modelValue?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="BaseListBox" role="listbox">
    <button
      v-for="option in options"
      :key="option.value"
      class="BaseListBox_Item"
      :class="{ BaseListBox_Item_selected: option.value === modelValue }"
      type="button"
      role="option"
      :aria-selected="option.value === modelValue"
      @click="handleSelect(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.BaseListBox {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background: var(--color-background-surface);
  box-shadow: var(--shadow);
  color: var(--color-text-default);
  overflow: hidden;
}

.BaseListBox_Item {
  border: none;
  width: 100%;
  text-align: left;
  padding: 12px 8px;
  background: var(--color-background-transparent);
  font: var(--font-medium-text-sm);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--color-background-default-hovered);
  }

  &:active {
    background: var(--color-background-default-pressed);
  }
}

.BaseListBox_Item_selected {
  background: var(--color-background-primary-invert);
}
</style>
