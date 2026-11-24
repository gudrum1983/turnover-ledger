<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { DropdownTypography, DropdownPlacement } from './types'
import { useLocale } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { ListBox, ListBoxExpand, animateListHeight, type ListBoxOption } from '@/shared/ui-v2/list-box'
import { DisclosureChevron } from '@/shared/ui-v2/disclosure-chevron'

type Props = {
  /** Список доступных вариантов */
  options: ListBoxOption[]
  /** Текущее выбранное значение */
  modelValue?: string
  /** Избранные значения вверху списка (строки из options.value) */
  favorites?: string[]
  /** Сворачивать список до избранных и выбранного значения; остальные — за строкой «Ещё» */
  collapsible?: boolean
  /** Текст строки раскрытия списка (без счётчика). По умолчанию — «Ещё» */
  expandText?: string
  /** Отключает взаимодействие с выпадающим списком */
  disabled?: boolean
  /** Класс корневого DOM-элемента */
  rootClass?: string
  /** Типографика подписи кнопки */
  typography?: DropdownTypography
  /** Выравнивание меню относительно кнопки */
  placement?: DropdownPlacement
}

const {
  options,
  modelValue,
  favorites,
  collapsible = false,
  expandText,
  disabled = false,
  rootClass = '',
  typography = 'body-m',
  placement = 'right',
} = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const { t } = useLocale()
const dropdownRef = ref<HTMLElement | null>(null)
const listBoxRef = ref<InstanceType<typeof ListBox> | null>(null)
const isOpen = ref(false)
const isKeyboardNavigation = ref(false)
const listId = useId()

// Избранные сверху, в том же порядке, в каком их рисует ListBox: индексы пунктов совпадают с id в списке.
const orderedOptions = computed(() => {
  if (!favorites?.length) return options
  const favoriteSet = new Set(favorites)
  return [
    ...options.filter((option) => favoriteSet.has(option.value)),
    ...options.filter((option) => !favoriteSet.has(option.value)),
  ]
})

// Свёрнутый список: избранные и выбранное значение (чтобы текущий выбор был виден), остальные скрыты.
// Раскрытие действует, пока список открыт.
const expanded = ref(false)
const collapsedOptions = computed(() => {
  if (!collapsible || expanded.value || !favorites?.length) return null
  const favoriteSet = new Set(favorites)
  const shown = orderedOptions.value.filter((option) => favoriteSet.has(option.value) || option.value === modelValue)
  return shown.length > 0 && shown.length < orderedOptions.value.length ? shown : null
})
const visibleOptions = computed(() => collapsedOptions.value ?? orderedOptions.value)
const hiddenCount = computed(() => orderedOptions.value.length - visibleOptions.value.length)
const expandLabel = computed(() => `${expandText ?? t('ui.common.showMore')} (${hiddenCount.value})`)

// Подсвеченный с клавиатуры вариант. Строка «Ещё» подсвечивается как последний вариант,
// значение у неё служебное.
const EXPAND_VALUE = Symbol('expand')
const expandId = `${listId}-expand`
const highlightedValue = ref<string | typeof EXPAND_VALUE>()
const isExpandHighlighted = computed(() => isKeyboardNavigation.value && highlightedValue.value === EXPAND_VALUE)
const highlightedIndex = computed(() =>
  highlightedValue.value === EXPAND_VALUE
    ? visibleOptions.value.length
    : visibleOptions.value.findIndex((option) => option.value === highlightedValue.value),
)
const highlightedId = computed(() => {
  if (highlightedIndex.value < 0) return undefined
  return highlightedValue.value === EXPAND_VALUE ? expandId : `${listId}-option-${highlightedIndex.value}`
})
const activeOptionValue = computed(() =>
  isKeyboardNavigation.value && typeof highlightedValue.value === 'string' ? highlightedValue.value : undefined,
)
const lastIndex = computed(() =>
  collapsedOptions.value ? visibleOptions.value.length : visibleOptions.value.length - 1,
)

function openMenu() {
  if (disabled) return
  highlightedValue.value = activeOption.value?.value ?? visibleOptions.value[0]?.value
  isOpen.value = true
}

async function highlight(index: number) {
  const list = visibleOptions.value
  const nextIndex = Math.max(0, Math.min(index, lastIndex.value))
  highlightedValue.value = nextIndex === list.length ? EXPAND_VALUE : list[nextIndex]?.value
  await nextTick()
  listBoxRef.value?.scrollToSelected()
}

// Раскрываем и подсвечиваем первый вариант из скрытых: туда пользователь и шёл.
function expand() {
  const listElement = listBoxRef.value?.$el as HTMLElement | undefined
  const fromHeight = listElement?.offsetHeight
  const shown = new Set(visibleOptions.value.map((option) => option.value))
  expanded.value = true
  const firstHidden = visibleOptions.value.findIndex((option) => !shown.has(option.value))
  void highlight(firstHidden)
  void nextTick(() => animateListHeight(listElement, fromHeight))
}

function commitSelection() {
  if (highlightedValue.value === EXPAND_VALUE) {
    expand()
  } else if (highlightedValue.value !== undefined && highlightedValue.value !== modelValue) {
    handleSelect(highlightedValue.value)
  } else {
    closeMenu()
  }
}

let search = ''
let lastSearchTime = 0

const activeOption = computed<ListBoxOption | undefined>(() => options.find((option) => option.value === modelValue))

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
  expanded.value = false
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
  // composedPath, а не contains: строка «Ещё» после клика уже удалена из DOM,
  // а путь события запомнен на момент клика.
  if (!event.composedPath().includes(dropdownRef.value)) {
    closeMenu()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (disabled) return
  if (event.key === 'Tab') {
    // Tab на строке «Ещё» просто уводит фокус, ничего не выбирая.
    if (isOpen.value && highlightedValue.value !== EXPAND_VALUE) commitSelection()
    else closeMenu()
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
    isKeyboardNavigation.value = true
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
    else if (event.key === 'End') void highlight(lastIndex.value)
    else if (wasOpen && !event.altKey) {
      const step = event.key === 'PageDown' ? 10 : event.key === 'PageUp' ? -10 : event.key === 'ArrowDown' ? 1 : -1
      void highlight(highlightedIndex.value + step)
    }
    return
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    isKeyboardNavigation.value = true
    event.preventDefault()
    if (!isOpen.value) openMenu()
    const now = Date.now()
    search = now - lastSearchTime > 700 ? event.key : search + event.key
    lastSearchTime = now
    const query = [...search].every((char) => char === search[0]) ? search[0]! : search
    const start = query.length === 1 ? highlightedIndex.value + 1 : highlightedIndex.value
    const list = visibleOptions.value
    for (let offset = 0; offset < list.length; offset++) {
      const index = (Math.max(0, start) + offset) % list.length
      const option = list[index]!
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
  <div ref="dropdownRef" class="ButtonDropdown" :class="rootClass" @pointerdown="isKeyboardNavigation = false">
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
          <span class="ButtonDropdown_Label" :class="`u-typo-${typography}`">
            <slot name="label" :active-option="activeOption" :active-label="activeLabel">{{ activeLabel }}</slot>
          </span>
          <DisclosureChevron :open="isOpen" />
        </div>
      </slot>
    </ButtonBase>
    <Transition name="button-dropdown-menu" @enter="listBoxRef?.scrollToSelected()">
      <div v-if="isOpen" class="ButtonDropdown_Menu" :class="`ButtonDropdown_Menu_${placement}`">
        <div class="ButtonDropdown_MenuContent">
          <ListBox
            ref="listBoxRef"
            class="ButtonDropdown_ListBox"
            :id="listId"
            :option-id-prefix="listId"
            :active-value="activeOptionValue"
            :options="visibleOptions"
            :favorites="favorites"
            @mousedown.prevent
            :model-value="modelValue"
            @change="handleSelect"
          >
            <template v-if="collapsedOptions" #footer>
              <ListBoxExpand :id="expandId" :focused="isExpandHighlighted" @click="expand">
                {{ expandLabel }}
              </ListBoxExpand>
            </template>
          </ListBox>
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
  top: calc(100% + 4px);
  box-sizing: border-box;
  width: 100%;
  min-width: 220px;
  z-index: 10;
  border-radius: 16px;
  box-shadow: var(--shadow-dropdown);
}

.ButtonDropdown_Menu_left {
  left: 0;
}

.ButtonDropdown_Menu_center {
  left: 50%;
  transform: translateX(-50%);
}

.ButtonDropdown_Menu_right {
  right: 0;
}

.ButtonDropdown_MenuContent {
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
}

.ButtonDropdown_ListBox {
  box-sizing: border-box;
  // 5 пунктов, плюс разделитель, если он есть.
  max-height: calc(226px + var(--list-box-divider-space, 0px));
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
