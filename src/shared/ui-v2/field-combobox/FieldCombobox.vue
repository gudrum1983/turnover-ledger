<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useLocale } from '@/shared/i18n'
import { type DropdownOption, ListBox } from '@/shared/ui-v2/button-dropdown'
import { IconClose } from '@/shared/ui-v2/icons'

type Props = {
  /** Имя поля для формы (значение уходит в скрытый input) */
  name: string
  /** Текстовая подпись поля */
  label?: string
  /** Плейсхолдер для input */
  placeholder?: string
  /** Выбранное значение (option.value) */
  modelValue: string | null
  /** Варианты значений */
  options: DropdownOption[]
  /** Избранные значения вверху списка (только пока нет поискового запроса) */
  favorites?: string[]
  /** Отключает ввод и выбор */
  disabled?: boolean
  /** Состояние ошибки валидации */
  error?: boolean
  /** Текст, когда ни один вариант не подошёл. По умолчанию — «Ничего не найдено». */
  emptyText?: string
}

const {
  name,
  label,
  placeholder,
  modelValue,
  options,
  favorites,
  disabled = false,
  error = false,
  emptyText,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const { t } = useLocale()
const inputId = useId()
const listId = `${inputId}-list`
const inputRef = ref<HTMLInputElement | null>(null)
const listBoxRef = ref<InstanceType<typeof ListBox> | null>(null)

// Как в FieldBase: тень фокуса только при навигации с клавиатуры.
const keyboardNavigation = ref(false)
function handleNavigationKey(event: KeyboardEvent) {
  if (event.key === 'Tab') keyboardNavigation.value = true
}
function handlePointerDown() {
  keyboardNavigation.value = false
}
onMounted(() => {
  document.addEventListener('keydown', handleNavigationKey, true)
  document.addEventListener('pointerdown', handlePointerDown, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleNavigationKey, true)
  document.removeEventListener('pointerdown', handlePointerDown, true)
})

const isOpen = ref(false)
// null — пользователь ничего не вводил: в поле подпись выбранного варианта, список не фильтруется.
const query = ref<string | null>(null)
const normalize = (value: string) => value.trim().toLocaleLowerCase()
const normalizedQuery = computed(() => normalize(query.value ?? ''))

const activeOption = computed(() => options.find((option) => option.value === modelValue))
const inputValue = computed(() => query.value ?? activeOption.value?.label ?? '')
const hasValue = computed(() => Boolean(inputValue.value))

// Без запроса — избранные сверху. С запросом — сначала совпадения с начала строки, потом вхождения.
const filteredOptions = computed(() => {
  const search = normalizedQuery.value
  if (!search) {
    if (!favorites?.length) return options
    const favoriteSet = new Set(favorites)
    return [
      ...options.filter((option) => favoriteSet.has(option.value)),
      ...options.filter((option) => !favoriteSet.has(option.value)),
    ]
  }

  const startsWith: DropdownOption[] = []
  const includes: DropdownOption[] = []
  for (const option of options) {
    const texts = [option.label, option.value, option.description ?? ''].map(normalize)
    if (texts.some((text) => text.startsWith(search))) startsWith.push(option)
    else if (texts.some((text) => text.includes(search))) includes.push(option)
  }
  return [...startsWith, ...includes]
})
const listFavorites = computed(() => (normalizedQuery.value ? undefined : favorites))

// Подсветка варианта, который выберут Enter или Tab. Видна после ввода или стрелок.
const highlightedValue = ref<string>()
const showHighlight = ref(false)
const highlightedIndex = computed(() =>
  filteredOptions.value.findIndex((option) => option.value === highlightedValue.value),
)
const highlightedId = computed(() =>
  showHighlight.value && highlightedIndex.value >= 0 ? `${listId}-option-${highlightedIndex.value}` : undefined,
)

async function highlight(index: number) {
  const list = filteredOptions.value
  highlightedValue.value = list[Math.max(0, Math.min(index, list.length - 1))]?.value
  await nextTick()
  listBoxRef.value?.scrollToSelected()
}

function openMenu() {
  if (disabled || isOpen.value) return
  highlightedValue.value = modelValue ?? filteredOptions.value[0]?.value
  isOpen.value = true
}

function closeMenu() {
  isOpen.value = false
  query.value = null
  showHighlight.value = false
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function select(value: string) {
  if (value !== modelValue) emit('update:modelValue', value)
  closeMenu()
}

function commitHighlighted() {
  if (highlightedValue.value !== undefined && highlightedIndex.value >= 0) select(highlightedValue.value)
  else closeMenu()
}

function handleInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  showHighlight.value = true
  openMenu()
  void highlight(0)
}

function handleKeydown(event: KeyboardEvent) {
  if (disabled) return

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp':
    case 'PageDown':
    case 'PageUp': {
      event.preventDefault()
      showHighlight.value = true
      if (!isOpen.value) {
        openMenu()
        void highlight(highlightedIndex.value)
        return
      }
      if (event.altKey) {
        if (event.key === 'ArrowUp') commitHighlighted()
        return
      }
      const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 10, PageUp: -10 }
      void highlight(highlightedIndex.value + steps[event.key]!)
      return
    }
    case 'Enter':
      // Закрытый список не трогаем: Enter отправляет форму.
      if (!isOpen.value) return
      event.preventDefault()
      commitHighlighted()
      return
    case 'Escape':
      if (!isOpen.value && query.value === null) return
      event.preventDefault()
      event.stopPropagation()
      closeMenu()
      return
    case 'Tab':
      if (isOpen.value && showHighlight.value) commitHighlighted()
      return
  }
}

// При уходе из поля введённый текст, точно совпавший с вариантом, выбирает его; иначе возвращается выбранное.
function handleBlur() {
  if (query.value !== null && normalizedQuery.value) {
    const match = options.find(
      (option) =>
        normalize(option.label) === normalizedQuery.value || normalize(option.value) === normalizedQuery.value,
    )
    if (match) {
      select(match.value)
      return
    }
  }
  closeMenu()
}

// Клик по рамке или отступам ведёт себя как клик по input.
function handleControlMouseDown(event: MouseEvent) {
  if (disabled || event.target === inputRef.value) return
  event.preventDefault()
  inputRef.value?.focus()
  toggleMenu()
}

function clearValue() {
  if (modelValue !== null) emit('update:modelValue', null)
  query.value = null
  showHighlight.value = false
  inputRef.value?.focus()
}

const classList = computed(() => ({
  FieldCombobox_keyboardNavigation: keyboardNavigation.value,
  FieldCombobox_empty: !hasValue.value,
  FieldCombobox_filled: hasValue.value,
  FieldCombobox_open: isOpen.value,
  FieldCombobox_error: error,
  FieldCombobox_disabled: disabled,
}))
</script>

<template>
  <div class="FieldCombobox" :class="classList">
    <label v-if="label" :for="inputId" class="FieldCombobox-Label u-typo-body-small-m">{{ label }}</label>

    <div class="FieldCombobox-Control" @mousedown="handleControlMouseDown">
      <input type="hidden" :name="name" :value="modelValue ?? ''" />
      <input
        :id="inputId"
        ref="inputRef"
        class="FieldCombobox-Input u-typo-body-m"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="isOpen"
        :aria-controls="isOpen ? listId : undefined"
        :aria-activedescendant="isOpen ? highlightedId : undefined"
        :aria-invalid="error ? 'true' : undefined"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        @click="toggleMenu"
      />
      <Transition name="field-icon">
        <button
          v-if="hasValue && !disabled"
          class="FieldCombobox-Clear"
          type="button"
          tabindex="-1"
          :aria-label="t('ui.common.clearField')"
          @mousedown.prevent.stop
          @click="clearValue"
        >
          <IconClose />
        </button>
      </Transition>
    </div>

    <Transition name="field-combobox-menu" @enter="listBoxRef?.scrollToSelected()">
      <div v-if="isOpen" class="FieldCombobox-Menu">
        <div class="FieldCombobox-MenuContent">
          <ListBox
            v-if="filteredOptions.length"
            :id="listId"
            ref="listBoxRef"
            class="FieldCombobox-ListBox"
            :option-id-prefix="listId"
            :options="filteredOptions"
            :favorites="listFavorites"
            :model-value="modelValue ?? undefined"
            :active-value="showHighlight ? highlightedValue : undefined"
            @mousedown.prevent
            @change="select"
          />
          <div v-else class="FieldCombobox-Empty u-typo-body-m" role="status">
            {{ emptyText ?? t('ui.common.nothingFound') }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
// Палитра и состояния повторяют FieldBase, чтобы поле выглядело как остальные поля v2.
.FieldCombobox {
  position: relative;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  --color-background-default: var(--white);
  --color-background-disabled: var(--neutral-100);

  --color-border-empty: var(--neutral-400);
  --color-border-empty-hover: var(--neutral-500);
  --color-border-empty-focus: var(--neutral-500);
  --color-border-empty-focus-tab: transparent;
  --color-border-empty-disabled: var(--neutral-100);

  --color-border-filled: var(--neutral-400);
  --color-border-filled-hover: var(--neutral-500);
  --color-border-filled-focus: var(--neutral-500);
  --color-border-filled-focus-tab: transparent;
  --color-border-filled-disabled: var(--neutral-100);

  --color-text-placeholder: var(--neutral-400);
  --color-text-placeholder-disabled: var(--neutral-400);

  --color-text-default: var(--neutral-900);
  --color-text-disabled: var(--neutral-500);

  --color-icons: var(--neutral-500);
  --color-icons-hover: var(--neutral-700);
  --color-icons-focus: var(--neutral-700);

  --box-shadow-input-focus-tab: 0px 0px 0px 3px #f5c96a99;

  --color-label-default: var(--neutral-900);
}

.FieldCombobox_empty {
  --field-border: var(--color-border-empty);
  --field-border-hover: var(--color-border-empty-hover);
  --field-border-focus: var(--color-border-empty-focus);
  --field-border-focus-tab: var(--color-border-empty-focus-tab);
}

.FieldCombobox_filled {
  --field-border: var(--color-border-filled);
  --field-border-hover: var(--color-border-filled-hover);
  --field-border-focus: var(--color-border-filled-focus);
  --field-border-focus-tab: var(--color-border-filled-focus-tab);
}

.FieldCombobox_error {
  --color-border-empty: var(--red-400);
  --color-border-empty-hover: var(--red-500);
  --color-border-empty-focus: var(--red-500);

  --color-border-filled: var(--red-500);
  --color-border-filled-hover: var(--red-500);
  --color-border-filled-focus: var(--red-500);

  --color-icons: var(--red-400);
  --color-icons-hover: var(--red-500);
  --color-icons-focus: var(--red-500);

  --box-shadow-input-focus-tab: 0 0 0 3px #c05a5a66;
}

.FieldCombobox-Label {
  color: var(--color-label-default);
}

.FieldCombobox-Control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding-inline: 16px;
  background: var(--color-background-default);
  border: 1px solid var(--field-border);
  border-radius: 24px;
  color: var(--color-icons);
  cursor: pointer;

  transition:
    background-color var(--transition-color),
    border-color var(--transition-color),
    box-shadow var(--transition-color),
    color var(--transition-color);

  &:hover {
    border-color: var(--field-border-hover);
    color: var(--color-icons-hover);
  }

  &:focus-within {
    border-color: var(--field-border-focus);
    color: var(--color-icons-focus);
  }

  .FieldCombobox_keyboardNavigation &:focus-within {
    border-color: var(--field-border-focus-tab);
    box-shadow: var(--box-shadow-input-focus-tab);
  }
}

.FieldCombobox-Input {
  flex: 1;
  min-width: 0;
  width: 100%;
  min-height: 46px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-default);
  text-overflow: ellipsis;
  cursor: pointer;

  &:focus {
    cursor: text;
  }

  &::placeholder {
    color: var(--color-text-placeholder);
  }
}

.FieldCombobox-Clear {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-icons);
  cursor: pointer;
  // Как в FieldBase: крестик виден только при наведении на поле или фокусе внутри него.
  opacity: var(--clear-opacity, 0);
  transform: scale(var(--clear-scale, 0.85));
  pointer-events: var(--clear-pointer-events, none);
  transition:
    color var(--transition-color),
    opacity var(--transition-color),
    transform var(--transition-color);

  &:hover {
    color: var(--color-icons-hover);
  }
}

.FieldCombobox-Control:hover,
.FieldCombobox-Control:focus-within {
  --clear-opacity: 1;
  --clear-scale: 1;
  --clear-pointer-events: auto;
}

.FieldCombobox-Menu {
  display: grid;
  grid-template-rows: 1fr;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  box-sizing: border-box;
  width: 100%;
  z-index: 10;
  border-radius: 16px;
  box-shadow: 0 6px 16px 0 #00000033;
}

.FieldCombobox-MenuContent {
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
}

.FieldCombobox-ListBox {
  box-sizing: border-box;
  max-height: 226px;
  box-shadow: none;
}

.FieldCombobox-Empty {
  padding: 12px 24px;
  border: 1px solid #d5dfe2;
  border-radius: inherit;
  background: var(--color-background-surface);
  color: var(--neutral-600);
}

.FieldCombobox_disabled {
  .FieldCombobox-Control {
    background: var(--color-background-disabled);
    border-color: var(--color-border-empty-disabled);
    color: var(--color-text-disabled);
    box-shadow: none;
    cursor: not-allowed;
  }

  .FieldCombobox-Input {
    color: var(--color-text-disabled);
    cursor: not-allowed;

    &::placeholder {
      color: var(--color-text-placeholder-disabled);
    }
  }
}

.field-icon-enter-active,
.field-icon-leave-active {
  transition:
    opacity var(--transition-color),
    transform var(--transition-color);
}

.field-icon-enter-from,
.field-icon-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.field-combobox-menu-enter-active {
  transition:
    grid-template-rows var(--transition-collapse-enter),
    opacity var(--transition-collapse-enter);
}

.field-combobox-menu-leave-active {
  pointer-events: none;
  transition:
    grid-template-rows var(--transition-collapse-leave),
    opacity var(--transition-collapse-leave);
}

.field-combobox-menu-enter-from,
.field-combobox-menu-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
</style>
