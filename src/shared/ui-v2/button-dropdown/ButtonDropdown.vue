<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { ListBox } from './list-box'
import { DisclosureChevron } from '@/shared/ui-v2/disclosure-chevron'

type Props = {
  /** Список доступных вариантов */
  options: Array<{
    value: string
    label: string
  }>
  /** Текущее выбранное значение */
  modelValue?: string
  /** Отключает взаимодействие с выпадающим списком */
  disabled?: boolean
  /** Класс корневого DOM-элемента */
  rootClass?: string
}

type DropdownOption = {
  value: string
  label: string
}

const { options, modelValue, disabled = false, rootClass = '' } = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const listBoxRef = ref<InstanceType<typeof ListBox> | null>(null)
const isOpen = ref(false)

const activeOption = computed<DropdownOption | undefined>(() => options.find((option) => option.value === modelValue))

const activeLabel = computed(() => {
  return activeOption.value?.label
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
    <ButtonBase
      variant="page"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleMenu"
      class="ButtonDropdown"
    >
      <slot name="trigger" :active-option="activeOption" :active-label="activeLabel" :is-open="isOpen">
        <div class="ButtonDropdown_Trigger">
          <span class="ButtonDropdown_Label u-typo-body-m">
            <slot name="label" :active-option="activeOption" :active-label="activeLabel">{{ activeLabel }}</slot>
          </span>
          <DisclosureChevron :open="isOpen" />
        </div>
      </slot>
    </ButtonBase>
    <Transition name="button-dropdown-menu" @enter="listBoxRef?.scrollToSelected()">
      <div v-if="isOpen" class="ButtonDropdown_Menu">
        <div class="ButtonDropdown_MenuContent">
          <ListBox
            ref="listBoxRef"
            class="ButtonDropdown_ListBox"
            :options="options"
            :model-value="modelValue"
            @change="handleSelect"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.ButtonDropdown {
  display: flex;
  flex-direction: column;
  position: relative;
  width: fit-content;
}

.ButtonDropdown_Trigger {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ButtonDropdown_Label {
  white-space: nowrap;
}

.ButtonDropdown_Menu {
  display: grid;
  grid-template-rows: 1fr;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  box-sizing: border-box;
  width: 100%;
  min-width: 220px;
  z-index: 10;
  border-radius: 16px;
  box-shadow: 0 6px 16px 0 #00000033;
}

.ButtonDropdown_MenuContent {
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
}

.ButtonDropdown_ListBox {
  box-sizing: border-box;
  max-height: 226px;
  box-shadow: none;
}

.button-dropdown-menu-enter-active {
  transition:
    grid-template-rows var(--transition-collapse-enter),
    opacity var(--transition-collapse-enter);
}

.button-dropdown-menu-leave-active {
  pointer-events: none;
  transition:
    grid-template-rows var(--transition-collapse-leave),
    opacity var(--transition-collapse-leave);
}

.button-dropdown-menu-enter-from,
.button-dropdown-menu-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
</style>
