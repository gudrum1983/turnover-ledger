<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from './BaseButton.vue'

import type { Colors } from '@/shared/types/colorsProp.ts'
import BaseListBox from './BaseListBox.vue'
import IconChevron from '@/shared/ui/icons/IconChevron.vue'

type Variant = 'fill' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

type Option = {
  value: string
  label: string
}

type Props = {
  options: Option[]
  modelValue?: string
  placeholder?: string
  size?: Size
  variant?: Variant
  color?: Colors
  disabled?: boolean
}

const {
  options,
  modelValue,
  placeholder = 'Выбрать',
  size = 'md',
  variant = 'outline',
  color = 'default',
  disabled = false,
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
  <div ref="dropdownRef" class="BaseDropdownButton">
    <BaseButton
      :size="size"
      full-width
      :variant="variant"
      :color="color"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleMenu"
      class="BaseDropdownButton_CustomClass"
    >
      <span class="BaseDropdownButton_Label">{{ activeLabel }}</span>
      <template #end-icon>
        <IconChevron
          class="BaseDropdownButton_Caret"
          :class="{ BaseDropdownButton_Caret_open: isOpen }"
          aria-hidden="true"
        />
      </template>
    </BaseButton>
    <div v-if="isOpen" class="BaseDropdownButton_Menu">
      <BaseListBox :options="options" :model-value="modelValue" @change="handleSelect" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.BaseDropdownButton {
  position: relative;
  display: inline-flex;
  width: 110px;
}

.BaseDropdownButton_CustomClass {
  justify-content: space-between;
}

.BaseDropdownButton_Label {
  white-space: nowrap;
}

.BaseDropdownButton_Caret_open {
  transform: rotate(180deg);
}

/*TODO - откорректировать стили*/

.BaseDropdownButton_Menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 110px;
  padding: 6px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: var(--color-background-surface);
  box-shadow: 0 10px 24px rgba(22, 30, 57, 0.12);
  z-index: 10;
}
</style>
