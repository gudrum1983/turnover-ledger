<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ButtonBase } from '@/shared/ui/button-base'
import { ListBox } from '@/shared/ui/list-box'
import { IconChevron } from '@/shared/ui/icons'

type Props = {
  /** Текстовый лейбл над кнопкой */
  label?: string
  /** Список доступных вариантов */
  options: Array<{
    value: string
    label: string
  }>
  /** Текущее выбранное значение */
  modelValue?: string
  /** Текст кнопки, когда значение не выбрано */
  placeholder?: string
  /** Размер кнопки */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** Визуальный вариант кнопки */
  variant?: 'filled' | 'outlined'
  /** Цвет кнопки */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** Отключает взаимодействие с выпадающим списком */
  disabled?: boolean
  /** Значения, которые нужно показывать в начале списка как избранные */
  favorites?: string[]
  /** Класс корневого DOM-элемента */
  rootClass?: string
}

const {
  label,
  options,
  modelValue,
  placeholder = 'Выбрать',
  size = 'md',
  variant = 'outlined',
  color = 'default',
  disabled = false,
  favorites,
  rootClass = '',
} = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const activeLabel = computed(() => {
  const match = options.find((option) => option.value === modelValue)
  return match?.label ?? placeholder
})

const toggleMenu = () => {
  if (disabled) {
    return
  }
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  closeMenu()
}

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value || !dropdownRef.value) {
    return
  }
  if (!dropdownRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) {
    return
  }
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="dropdownRef" class="ButtonDropdown" :class="rootClass">
    <p v-if="label" class="Typo_Caption">{{ label }}</p>
    <ButtonBase
      :size="size"
      full-width
      :variant="variant"
      :color="color"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleMenu"
      class="ButtonDropdown_CustomClass"
    >
      <span class="ButtonDropdown_Label">{{ activeLabel }}</span>
      <template #end-icon>
        <IconChevron class="ButtonDropdown_Caret" :class="{ ButtonDropdown_Caret_open: isOpen }" aria-hidden="true" />
      </template>
    </ButtonBase>
    <ListBox
      class="ButtonDropdown_Menu"
      :options="options"
      :model-value="modelValue"
      :favorites="favorites"
      @change="handleSelect"
      v-if="isOpen"
    />
  </div>
</template>

<style scoped lang="scss">
.ButtonDropdown {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 110px;
}

.ButtonDropdown_CustomClass {
  justify-content: space-between;
  border-radius: 4px;
}

.ButtonDropdown_Label {
  white-space: nowrap;
}

.ButtonDropdown_Caret_open {
  transform: rotate(180deg);
}

.ButtonDropdown_Menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  width: 110px;
  z-index: 10;
  max-height: 260px;
  overflow-y: auto;
}
</style>
