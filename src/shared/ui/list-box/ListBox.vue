<script setup lang="ts">
import { computed } from 'vue'
import { DividerBase } from '@/shared/ui/divider-base'

interface Props {
  /** Варианты значений */
  options: Array<{
    value: string
    label: string
  }>
  /** Выбранное значение из списка */
  modelValue?: string
  /** Избранные значения для отображения вверху списка (строки из options.value) */
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
  <div class="ListBox" role="listbox">
    <div class="ListBox_List">
      <button
        v-for="option in favoriteOptions"
        :key="option.value"
        class="ListBox_Item"
        :class="{ ListBox_Item_selected: option.value === modelValue }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
      >
        {{ option.label }}
      </button>
      <DividerBase v-if="favoriteOptions.length > 0 && otherOptions.length > 0" :edge-offset="5" lineStyle="dashed" />
      <button
        v-for="option in otherOptions"
        :key="option.value"
        class="ListBox_Item"
        :class="{ ListBox_Item_selected: option.value === modelValue }"
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
.ListBox {
  display: flex;
  border-radius: 4px;
  background: var(--color-background-surface);
  box-shadow: var(--shadow);
  color: var(--color-text-default);
  overflow: hidden;
  width: 100%;

  &_List {
    overflow: auto;
    width: 100%;
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
