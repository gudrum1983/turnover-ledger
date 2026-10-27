<script setup lang="ts">
import { computed, ref } from 'vue'
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
const listRef = ref<HTMLElement | null>(null)

function scrollToSelected() {
  const list = listRef.value
  const selected = list?.querySelector<HTMLElement>('[aria-selected="true"]')
  if (!list || !selected) return

  const listRect = list.getBoundingClientRect()
  const selectedRect = selected.getBoundingClientRect()
  if (selectedRect.top < listRect.top) {
    list.scrollBy({ top: selectedRect.top - listRect.top, behavior: 'instant' })
  } else if (selectedRect.bottom > listRect.bottom) {
    list.scrollBy({ top: selectedRect.bottom - listRect.bottom, behavior: 'instant' })
  }
}

defineExpose({ scrollToSelected })

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
    <div ref="listRef" class="ListBox_List">
      <button
        v-for="option in favoriteOptions"
        :key="option.value"
        class="ListBox_Item u-typo-body-m"
        :class="{ ListBox_Item_selected: option.value === modelValue }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
      >
        <span>{{ option.value }}</span
        >{{ option.label }}
      </button>
      <DividerBase v-if="favoriteOptions.length > 0 && otherOptions.length > 0" :edge-offset="5" lineStyle="dashed" />
      <button
        v-for="option in otherOptions"
        :key="option.value"
        class="ListBox_Item u-typo-body-m"
        :class="{ ListBox_Item_selected: option.value === modelValue }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
      >
        <span
          >{{ option.value }} <span class="ListBox_ItemDescription"> {{ option.label }}</span></span
        >
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ListBox {
  display: flex;
  padding: 8px;
  border-radius: 16px;
  background: var(--color-background-surface);
  /*box-shadow: var(--shadow);*/
  color: var(--color-text-default);
  width: 100%;
  border: 1px solid #d5dfe2;
  box-shadow: 0 6px 16px 0 #00000033;

  &_List {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
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
    padding: 0 16px;
    min-height: 40px;
    background: inherit;

    cursor: pointer;
    transition: all var(--transition);
    text-wrap: nowrap;
    border-radius: 24px;

    .ListBox_ItemDescription {
      color: var(--neutral-600);
      transition: all var(--transition);
    }

    &:hover {
      background: var(--neutral-100);
    }

    &:active {
      background: var(--blue-400);
      color: var(--white);
      .ListBox_ItemDescription {
        color: var(--white);
      }
    }

    &_selected {
      background: var(--blue-400);
      color: var(--white);
      .ListBox_ItemDescription {
        color: var(--white);
      }
    }
  }
}
</style>
