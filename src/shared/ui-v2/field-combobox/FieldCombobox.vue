<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useLocale } from '@/shared/i18n'
import { ListBox, ListBoxExpand, animateListHeight, type ListBoxOption } from '@/shared/ui-v2/list-box'
import { IconClose, IconDangerCircle, IconQuestion } from '@/shared/ui-v2/icons'
import { FieldTooltip } from '@/shared/ui-v2/field-base'

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
  options: ListBoxOption[]
  /** Избранные значения вверху списка (только пока нет поискового запроса) */
  favorites?: string[]
  /** Отключает ввод и выбор */
  disabled?: boolean
  /** Состояние ошибки валидации */
  error?: boolean
  /** Сообщение об ошибке в тултипе (показывается вместе с error). */
  errorMessage?: string
  /** Текст информационной подсказки: иконка «?» в поле и тултип */
  hint?: string
  /** Текст, когда ни один вариант не подошёл. По умолчанию — «Ничего не найдено». */
  emptyText?: string
  /** Выравнивание списка относительно поля, если список шире поля. */
  placement?: 'left' | 'right'
  /** Показывать в поле после выбранного значения его selectedDescription или description (серым, как в списке). */
  showDescription?: boolean
  /**
   * Без поискового запроса показывать только избранные (и выбранное значение), остальные — по строке
   * «Ещё (N)» в конце списка. Поиск всегда идёт по всем вариантам.
   */
  collapsible?: boolean
  /** Текст строки, раскрывающей список. По умолчанию — «Ещё». Количество скрытых добавляется в скобках. */
  expandText?: string
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
  errorMessage,
  hint,
  emptyText,
  placement = 'left',
  showDescription = false,
  collapsible = false,
  expandText,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  /** Фокус ушёл из поля. Клик по крестику и выбор из списка фокус не уводят. */
  (e: 'blur'): void
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

// Подсказка и ошибка — как в FieldBase: иконка «?» (или «!» при ошибке) и тултип у поля.
// Тултип открывается при наведении и фокусе на иконке, а при ошибке — и при фокусе в поле; Esc его закрывает.
// Пока открыт список, тултип не показываем: он открывается под полем, там же, где список.
const controlRef = ref<HTMLElement | null>(null)
const inputFocused = ref(false)
const iconFocused = ref(false)
const iconHovered = ref(false)
const tooltipHovered = ref(false)
const tooltipDismissed = ref(false)
const hasErrorMessage = computed(() => error && Boolean(errorMessage))
const errorId = `${inputId}-error`
const tooltipOpen = computed(
  () =>
    !tooltipDismissed.value &&
    !isOpen.value &&
    (iconFocused.value || iconHovered.value || tooltipHovered.value || (hasErrorMessage.value && inputFocused.value)),
)
function showTooltip() {
  tooltipDismissed.value = false
}

function handleIconMouseEnter() {
  iconHovered.value = true
  showTooltip()
}

function handleIconFocus() {
  iconFocused.value = true
  showTooltip()
}

function handleInputFocus() {
  inputFocused.value = true
  showTooltip()
}
// null — пользователь ничего не вводил: в поле подпись выбранного варианта, список не фильтруется.
const query = ref<string | null>(null)
const normalize = (value: string) => value.trim().toLocaleLowerCase()
const normalizedQuery = computed(() => normalize(query.value ?? ''))

const activeOption = computed(() => options.find((option) => option.value === modelValue))
const inputValue = computed(() => query.value ?? activeOption.value?.label ?? '')
const hasValue = computed(() => Boolean(inputValue.value))
// Подпись выбранного варианта видна, пока пользователь ничего не вводит.
// Сам input при этом прозрачный (курсор виден), текст рисует слой поверх с тем же шрифтом.
const shownDescription = computed(() =>
  showDescription && query.value === null
    ? (activeOption.value?.selectedDescription ?? activeOption.value?.description)
    : undefined,
)
const descriptionId = `${inputId}-description`

// Без запроса — избранные сверху. С запросом — сначала совпадения с начала строки, потом вхождения.
// Ищем по label, value и keywords (без keywords — по description).
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

  const startsWith: ListBoxOption[] = []
  const includes: ListBoxOption[] = []
  for (const option of options) {
    const texts = [option.label, option.value, ...(option.keywords ?? [option.description ?? ''])].map(normalize)
    if (texts.some((text) => text.startsWith(search))) startsWith.push(option)
    else if (texts.some((text) => text.includes(search))) includes.push(option)
  }
  return [...startsWith, ...includes]
})
const listFavorites = computed(() => (normalizedQuery.value ? undefined : favorites))

// Свёрнутый список: избранные и выбранное значение (чтобы текущий выбор был виден), остальные скрыты.
// Раскрытие действует, пока список открыт.
const expanded = ref(false)
const collapsedOptions = computed(() => {
  if (!collapsible || expanded.value || normalizedQuery.value || !favorites?.length) return null
  const favoriteSet = new Set(favorites)
  const shown = filteredOptions.value.filter((option) => favoriteSet.has(option.value) || option.value === modelValue)
  return shown.length > 0 && shown.length < filteredOptions.value.length ? shown : null
})
const visibleOptions = computed(() => collapsedOptions.value ?? filteredOptions.value)
const hiddenCount = computed(() => filteredOptions.value.length - visibleOptions.value.length)
const expandLabel = computed(() => `${expandText ?? t('ui.common.showMore')} (${hiddenCount.value})`)

// Подсветка варианта, который выберут Enter или Tab. Видна после ввода или стрелок.
// Строка «Ещё» подсвечивается как последний вариант, значение у неё служебное.
const EXPAND_VALUE = Symbol('expand')
const expandId = `${listId}-expand`
const highlightedValue = ref<string | typeof EXPAND_VALUE>()
const showHighlight = ref(false)
const isExpandHighlighted = computed(() => showHighlight.value && highlightedValue.value === EXPAND_VALUE)
const highlightedIndex = computed(() =>
  highlightedValue.value === EXPAND_VALUE
    ? visibleOptions.value.length
    : visibleOptions.value.findIndex((option) => option.value === highlightedValue.value),
)
const highlightedId = computed(() => {
  if (!showHighlight.value || highlightedIndex.value < 0) return undefined
  return highlightedValue.value === EXPAND_VALUE ? expandId : `${listId}-option-${highlightedIndex.value}`
})
const activeOptionValue = computed(() =>
  showHighlight.value && typeof highlightedValue.value === 'string' ? highlightedValue.value : undefined,
)

async function highlight(index: number) {
  const list = visibleOptions.value
  const lastIndex = collapsedOptions.value ? list.length : list.length - 1
  const nextIndex = Math.max(0, Math.min(index, lastIndex))
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

function openMenu() {
  if (disabled || isOpen.value) return
  highlightedValue.value = modelValue ?? visibleOptions.value[0]?.value
  isOpen.value = true
}

function closeMenu() {
  isOpen.value = false
  query.value = null
  showHighlight.value = false
  expanded.value = false
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
  if (highlightedValue.value === EXPAND_VALUE) expand()
  else if (highlightedValue.value !== undefined && highlightedIndex.value >= 0) select(highlightedValue.value)
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
      // Tab на строке «Ещё» просто уводит фокус, ничего не выбирая.
      if (isOpen.value && showHighlight.value && highlightedValue.value !== EXPAND_VALUE) commitHighlighted()
      return
  }
}

// При уходе из поля введённый текст, точно совпавший с вариантом, выбирает его; иначе возвращается выбранное.
function handleBlur() {
  inputFocused.value = false
  if (query.value !== null && normalizedQuery.value) {
    const match = options.find(
      (option) =>
        normalize(option.label) === normalizedQuery.value || normalize(option.value) === normalizedQuery.value,
    )
    if (match) select(match.value)
  }
  closeMenu()
  emit('blur')
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

    <div
      ref="controlRef"
      class="FieldCombobox-Control"
      @mousedown="handleControlMouseDown"
      @keydown.esc="tooltipDismissed = true"
    >
      <Transition name="field-icon">
        <button
          v-if="(hasErrorMessage || hint) && !disabled"
          class="FieldCombobox-Hint"
          type="button"
          :aria-label="hasErrorMessage ? errorMessage : hint"
          :aria-describedby="hasErrorMessage ? errorId : undefined"
          @mousedown.stop
          @mouseenter="handleIconMouseEnter"
          @mouseleave="iconHovered = false"
          @focus="handleIconFocus"
          @blur="iconFocused = false"
          @click="showTooltip"
        >
          <span class="FieldCombobox-HintIconSlot">
            <Transition name="field-icon">
              <IconDangerCircle v-if="hasErrorMessage" key="error" class="FieldCombobox-HintIcon" />
              <IconQuestion v-else key="hint" class="FieldCombobox-HintIcon" />
            </Transition>
          </span>
        </button>
      </Transition>
      <input type="hidden" :name="name" :value="modelValue ?? ''" />
      <span class="FieldCombobox-InputWrap">
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
          :aria-describedby="
            [shownDescription && descriptionId, hasErrorMessage && errorId].filter(Boolean).join(' ') || undefined
          "
          :class="{ 'FieldCombobox-Input_overlaid': shownDescription }"
          :value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          @input="handleInput"
          @keydown="handleKeydown"
          @focus="handleInputFocus"
          @blur="handleBlur"
          @click="toggleMenu"
        />
        <span v-if="shownDescription" class="FieldCombobox-Display u-typo-body-m" aria-hidden="true">
          <span class="FieldCombobox-DisplayText"
            >{{ activeOption?.label
            }}<span :id="descriptionId" class="FieldCombobox-DisplayDescription">{{
              ' ' + shownDescription
            }}</span></span
          >
        </span>
      </span>
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
      <FieldTooltip
        :open="tooltipOpen && !disabled && Boolean(hasErrorMessage || hint)"
        :error-message="hasErrorMessage ? errorMessage : undefined"
        :hint="hint"
        :anchor="controlRef"
        @mouseenter="tooltipHovered = true"
        @mouseleave="tooltipHovered = false"
      />
    </div>

    <span :id="errorId" class="FieldCombobox-AccessibleError" aria-live="polite">{{
      hasErrorMessage ? errorMessage : ''
    }}</span>

    <Transition name="field-combobox-menu" @enter="listBoxRef?.scrollToSelected()">
      <div v-if="isOpen" class="FieldCombobox-Menu" :class="`FieldCombobox-Menu_placement_${placement}`">
        <div class="FieldCombobox-MenuContent">
          <ListBox
            v-if="visibleOptions.length"
            :id="listId"
            ref="listBoxRef"
            class="FieldCombobox-ListBox"
            :option-id-prefix="listId"
            :options="visibleOptions"
            :favorites="listFavorites"
            :model-value="modelValue ?? undefined"
            :active-value="activeOptionValue"
            @mousedown.prevent
            @change="select"
          >
            <template v-if="collapsedOptions" #footer>
              <ListBoxExpand :id="expandId" :focused="isExpandHighlighted" @click="expand">
                {{ expandLabel }}
              </ListBoxExpand>
            </template>
          </ListBox>
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
  --box-shadow-icons-focus-tab: 0px 0px 0px 3px #f5c96a99;

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
  --box-shadow-icons-focus-tab: 0 0 0 3px #c05a5a66;
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

.FieldCombobox-InputWrap {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
}

// Слой с выбранным значением и его подписью поверх прозрачного input.
.FieldCombobox-Display {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  min-width: 0;
  pointer-events: none;
  color: var(--color-text-default);
}

.FieldCombobox-DisplayText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.FieldCombobox-DisplayDescription {
  color: var(--neutral-600);
}

// Специфичнее правил disabled, иначе в отключённом поле текст input проступит под слоем.
.FieldCombobox .FieldCombobox-Input.FieldCombobox-Input_overlaid {
  color: transparent;
  caret-color: var(--color-text-default);
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

// Иконка подсказки — как FieldBase-Hint.
.FieldCombobox-Hint {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-icons);
  transition: color var(--transition-color);
  cursor: help;

  &:hover {
    color: var(--color-icons-hover);
  }

  &:focus {
    outline: none;
    color: var(--color-icons-focus);
  }

  .FieldCombobox_keyboardNavigation &:focus {
    color: var(--color-icons-focus);
    box-shadow: var(--box-shadow-icons-focus-tab);
  }
}

// Сенсорный ввод: область нажатия значков расширена до полной высоты поля (48px), вид не меняется.
// По бокам — только 4px: шире слева крестик перехватывал бы нажатия, которыми ставят курсор в конец текста.
// any-pointer — чтобы работало и на ноутбуках с сенсорным экраном, где основное устройство — тачпад.
@media (any-pointer: coarse) {
  .FieldCombobox-Hint,
  .FieldCombobox-Clear {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -12px -4px;
    }
  }
}

.FieldCombobox-HintIconSlot {
  display: grid;
  width: 24px;
  height: 24px;
}

.FieldCombobox-HintIcon {
  grid-area: 1 / 1;
  width: 24px;
  height: 24px;
}

.FieldCombobox-AccessibleError {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
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
  box-sizing: border-box;
  // Список может быть шире узкого поля (например, код валюты с названием и курсом).
  width: max-content;
  min-width: 100%;
  max-width: 320px;
  z-index: 10;
  border-radius: 16px;
  box-shadow: var(--shadow-dropdown);
}

.FieldCombobox-Menu_placement_left {
  left: 0;
}

.FieldCombobox-Menu_placement_right {
  right: 0;
}

.FieldCombobox-MenuContent {
  min-height: 0;
  overflow: hidden;
  border-radius: inherit;
}

.FieldCombobox-ListBox {
  box-sizing: border-box;
  // 5 пунктов, плюс разделитель, если он есть.
  max-height: calc(226px + var(--list-box-divider-space, 0px));
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

  .FieldCombobox-Display,
  .FieldCombobox-DisplayDescription {
    color: var(--color-text-disabled);
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
