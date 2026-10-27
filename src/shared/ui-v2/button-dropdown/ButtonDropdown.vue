<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { DropdownOption } from './types'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { ListBox } from './list-box'
import { DisclosureChevron } from '@/shared/ui-v2/disclosure-chevron'

type Props = {
  /** Список доступных вариантов */
  options: DropdownOption[]
  /** Текущее выбранное значение */
  modelValue?: string
  /** Отключает взаимодействие с выпадающим списком */
  disabled?: boolean
  /** Класс корневого DOM-элемента */
  rootClass?: string
}

const { options, modelValue, disabled = false, rootClass = '' } = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const listBoxRef = ref<InstanceType<typeof ListBox> | null>(null)
const isOpen = ref(false)
const listId = useId()
const highlightedValue = ref<string>()
const highlightedIndex = computed(() => options.findIndex((option) => option.value === highlightedValue.value))
const highlightedId = computed(() =>
  highlightedIndex.value < 0 ? undefined : `${listId}-option-${highlightedIndex.value}`,
)

function openMenu() {
  if (disabled) return
  highlightedValue.value = activeOption.value?.value ?? options[0]?.value
  isOpen.value = true
}

async function highlight(index: number) {
  highlightedValue.value = options[Math.max(0, Math.min(index, options.length - 1))]?.value
  await nextTick()
  listBoxRef.value?.scrollToSelected()
}

function commitSelection() {
  if (highlightedValue.value !== undefined && highlightedValue.value !== modelValue) {
    handleSelect(highlightedValue.value)
  } else {
    closeMenu()
  }
}

let search = ''
let lastSearchTime = 0

const activeOption = computed<DropdownOption | undefined>(() => options.find((option) => option.value === modelValue))

const activeLabel = computed(() => {
  return activeOption.value?.label
})

const toggleMenu = () => {
  if (disabled) {
    return
  }
  if (isOpen.value) closeMenu()
  else openMenu()
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
  if (disabled) return
  if (event.key === 'Tab') {
    if (isOpen.value) commitSelection()
    return
  }
  if (event.key === 'Escape') {
    if (isOpen.value) {
      event.preventDefault()
      event.stopPropagation()
      closeMenu()
    }
    return
  }
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
    event.preventDefault()
    if (event.key === 'Enter' || event.key === ' ') {
      if (isOpen.value) commitSelection()
      else openMenu()
      return
    }
    const wasOpen = isOpen.value
    if (!wasOpen) openMenu()
    if (event.altKey && event.key === 'ArrowUp') {
      commitSelection()
      return
    }
    if (event.key === 'Home') void highlight(0)
    else if (event.key === 'End') void highlight(options.length - 1)
    else if (wasOpen && !event.altKey) {
      const step = event.key === 'PageDown' ? 10 : event.key === 'PageUp' ? -10 : event.key === 'ArrowDown' ? 1 : -1
      void highlight(highlightedIndex.value + step)
    }
    return
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    if (!isOpen.value) openMenu()
    const now = Date.now()
    search = now - lastSearchTime > 700 ? event.key : search + event.key
    lastSearchTime = now
    const query = [...search].every((char) => char === search[0]) ? search[0]! : search
    const start = query.length === 1 ? highlightedIndex.value + 1 : highlightedIndex.value
    for (let offset = 0; offset < options.length; offset++) {
      const index = (Math.max(0, start) + offset) % options.length
      const option = options[index]!
      if (
        option.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()) ||
        option.value.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
      ) {
        void highlight(index)
        break
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="ButtonDropdown" :class="rootClass">
    <ButtonBase
      variant="page"
      role="combobox"
      :disabled="disabled"
      :aria-controls="isOpen ? listId : undefined"
      :aria-activedescendant="isOpen ? highlightedId : undefined"
      @keydown="handleKeydown"
      @blur="closeMenu"
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
            :id="listId"
            :option-id-prefix="listId"
            :active-value="highlightedValue"
            :options="options"
            @mousedown.prevent
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
