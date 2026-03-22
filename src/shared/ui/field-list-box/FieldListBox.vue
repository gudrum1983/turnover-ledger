<script setup lang="ts">
import { computed } from 'vue'

type Option = {
  value: string
  label: string
}

type Props = {
  options: Option[]
  modelValue?: string
  favorites?: string[]
}

const props = defineProps<Props>()

const favoriteOptions = computed(() => {
  if (!props.favorites?.length) return []
  const favoriteSet = new Set(props.favorites)
  return props.options.filter((option) => favoriteSet.has(option.value))
})

const otherOptions = computed(() => {
  if (!props.favorites?.length) return props.options
  const favoriteSet = new Set(props.favorites)
  return props.options.filter((option) => !favoriteSet.has(option.value))
})

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
  <div class="FieldListBox" role="listbox">
    <div class="FieldListBox_List">
      <button
        v-for="option in favoriteOptions"
        :key="option.value"
        class="FieldListBox_Item"
        :class="{ FieldListBox_Item_selected: option.value === modelValue }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
      >
        {{ option.label }}
      </button>
      <div v-if="favoriteOptions.length > 0 && otherOptions.length > 0" class="FieldListBox_Divider" role="separator" />
      <button
        v-for="option in otherOptions"
        :key="option.value"
        class="FieldListBox_Item"
        :class="{ FieldListBox_Item_selected: option.value === modelValue }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.FieldListBox {
  display: flex;
  border-radius: 4px;
  background: var(--color-background-surface);
  box-shadow: var(--shadow);
  color: var(--color-text-default);
  overflow: hidden;

  &_List {
    overflow: auto;
  }

  &_Divider {
    height: 1px;
    background: var(--color-border-table-cell);
    margin: 0 10px;
  }

  &_Item {
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

    &_selected {
      background: var(--color-background-primary-invert);
    }
  }
}
</style>
