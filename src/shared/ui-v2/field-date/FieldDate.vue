<script setup lang="ts">
import { type ComponentPublicInstance, computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Locale } from 'date-fns'
import { ru } from 'date-fns/locale'
import { type InputAttributesConfig, VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useLocale } from '@/shared/i18n'
import { IconArrowLeft, IconArrowRight, IconCalendar, IconClose } from '@/shared/ui-v2/icons'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Подпись поля */
  label?: string
  /** Плейсхолдер поля, например «Выберите дату». Формат ДД.ММ.ГГГГ не нужен: ручного ввода нет. */
  placeholder?: string
  /** Текущее значение даты в формате YYYY-MM-DD */
  modelValue: string | null
  /** Делает поле обязательным */
  required?: boolean
  /** Отключает ввод и выбор даты */
  disabled?: boolean
  /** Год, которым ограничен выбор: доступны даты с 1 января по 31 декабря (но не позже сегодня).
   * Если задан, minDate и maxDate не используются. */
  year?: number
  /** Минимальная дата, доступная для выбора (без year) */
  minDate?: Date
  /** Максимальная дата, доступная для выбора (без year). По умолчанию — сегодня. */
  maxDate?: Date
  /** Показывает разделитель между шапкой с месяцем и днями недели в календаре. По умолчанию — показывает. */
  separator?: boolean
  /** Локаль для date-fns и календаря */
  dateFnsLocale?: Locale
}

const {
  name,
  label,
  placeholder,
  modelValue,
  required = false,
  disabled = false,
  year,
  minDate = new Date(2020, 0, 1),
  maxDate = new Date(),
  separator = true,
  dateFnsLocale = ru,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const { t } = useLocale()

// Как в FieldBase: тень фокуса только при навигации с клавиатуры.
// Слушаем document: первый Tab может прийти с элемента вне поля.
// Кроме Tab учитываем клавиши, которыми ходят по календарю: стрелки, Enter и пробел.
const NAVIGATION_KEYS = new Set(['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
const keyboardNavigation = ref(false)
// Фокус пришёл в поле по Tab (или Shift+Tab) — тогда сразу открываем календарь (см. handleFocusIn).
// Любая другая клавиша или клик сбрасывают признак: например, после Esc фокус возвращается в поле
// программно, и календарь открываться заново не должен.
let lastKeyWasTab = false
function handleNavigationKey(event: KeyboardEvent) {
  if (NAVIGATION_KEYS.has(event.key)) keyboardNavigation.value = true
  lastKeyWasTab = event.key === 'Tab'
  pendingFocus = null
}
function handlePointerDown() {
  keyboardNavigation.value = false
  lastKeyWasTab = false
  pendingFocus = null
}
onMounted(() => {
  document.addEventListener('keydown', handleNavigationKey, true)
  document.addEventListener('pointerdown', handlePointerDown, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleNavigationKey, true)
  document.removeEventListener('pointerdown', handlePointerDown, true)
})

const inputAttrs = computed<Partial<InputAttributesConfig>>(() => ({
  name,
  required,
  autocomplete: 'off',
}))

// Границы выбора: по году (31 декабря, но не позже сегодня) или по minDate / maxDate.
const bounds = computed(() => {
  if (year === undefined) return { min: minDate, max: maxDate }

  const today = new Date()
  const endOfYear = new Date(year, 11, 31)
  return { min: new Date(year, 0, 1), max: endOfYear < today ? endOfYear : today }
})

const yearRange = computed<[number, number]>(() => [bounds.value.min.getFullYear(), bounds.value.max.getFullYear()])
// Дни недели в шапке календаря: первая буква заглавная, остальные строчные («Пн», «Вт»).
const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase() + value.slice(1).toLocaleLowerCase()

// Месяц недоступен, если он целиком вне границ выбора (например, будущие месяцы текущего года).
function isMonthDisabled(month: number, monthYear: number) {
  const { min, max } = bounds.value
  const monthIndex = monthYear * 12 + month
  return monthIndex < min.getFullYear() * 12 + min.getMonth() || monthIndex > max.getFullYear() * 12 + max.getMonth()
}

// В сетке месяцев, как в днях: заливкой — месяц выбранной даты, рамкой — текущий месяц.
const isMonthSelected = (month: number, monthYear: number) =>
  Boolean(modelValue) && Number(modelValue!.slice(0, 4)) === monthYear && Number(modelValue!.slice(5, 7)) - 1 === month
const isCurrentMonth = (month: number, monthYear: number) => {
  const today = new Date()
  return today.getFullYear() === monthYear && today.getMonth() === month
}

// Выбор месяца в своей сетке: переключаем календарь и закрываем оверлей.
// toggle(true) — как в стандартной сетке vuepic: без true он сбрасывает flow (выбор «месяц → день»).
function selectMonth(
  month: number,
  monthYear: number,
  updateMonthYear: (m: number, y: number) => void,
  toggle: (fromFlow?: boolean) => void,
) {
  if (isMonthDisabled(month, monthYear)) return
  updateMonthYear(month, monthYear)
  toggle(true)
  // После выбора месяца — фокус на 1-е число (или первый доступный день месяца).
  holdFocus(findFirstDay)
}

// После выбора даты закрываем меню сами: если flow сбросили (например, кнопкой календаря внизу
// выбора месяца), vuepic применяет дату, но оставляет меню открытым.
const pickerRef = ref<InstanceType<typeof VueDatePicker> | null>(null)
function handleUpdate(value: string | null | undefined) {
  emit('update:modelValue', value ?? null)
  if (value) pickerRef.value?.closeMenu()
}

// Пробел на поле открывает и закрывает календарь, как Enter (Enter vuepic обрабатывает сам).
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== ' ' || disabled) return
  if (!(event.target instanceof HTMLElement) || !event.target.classList.contains('dp__input')) return
  event.preventDefault()
  pickerRef.value?.toggleMenu()
}

// Автофокус внутри календаря. vuepic сам переставляет фокус (на контейнер сетки месяцев,
// на кнопку возврата к календарю, на меню) уже после наших действий — поймать момент нельзя.
// Поэтому, пока пользователь ничего не нажал, любой фокус внутри поля переводим на нужный элемент.
// Первое нажатие клавиши или клик снимает перехват (см. handleNavigationKey / handlePointerDown).
type FocusTarget = () => HTMLElement | null | undefined
let pendingFocus: FocusTarget | null = null

function holdFocus(findTarget: FocusTarget) {
  pendingFocus = findTarget
  findTarget()?.focus({ preventScroll: true })
  // Новый вид (например, календарь после выбора месяца) отрисуется не сразу — пробуем ещё раз,
  // через два кадра, как это делает vuepic.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (pendingFocus === findTarget) findTarget()?.focus({ preventScroll: true })
    }),
  )
}

function handleFocusIn(event: FocusEvent) {
  if (
    lastKeyWasTab &&
    !disabled &&
    event.target instanceof HTMLElement &&
    event.target.classList.contains('dp__input')
  ) {
    lastKeyWasTab = false
    pickerRef.value?.openMenu()
    return
  }

  const target = pendingFocus?.()
  if (target && event.target !== target) {
    target.focus({ preventScroll: true })
    return
  }
  if (event.target instanceof HTMLElement) applyRovingTabindex(event.target)
}

// Tab не ходит по каждому дню и месяцу: в сетке в порядке Tab только ячейка с фокусом
// (tabindex 0, остальным -1), внутри сетки — стрелки. Vue не перезаписывает tabindex,
// пока он не меняется в разметке, поэтому достаточно переставлять его при фокусе.
const ROVING_GROUPS = [
  { cell: '.dp__calendar_item', group: '.dp__calendar' },
  { cell: '.FieldDate-MonthCell', group: '.FieldDate-MonthGrid' },
]
function applyRovingTabindex(element: HTMLElement) {
  const roving = ROVING_GROUPS.find(({ cell }) => element.matches(cell))
  const group = roving && element.closest(roving.group)
  if (!roving || !group) return
  group.querySelectorAll<HTMLElement>(roving.cell).forEach((cell) => {
    cell.tabIndex = cell === element ? 0 : -1
  })
}

// Стрелки по дням календаря: ←/→ — на день, ↑/↓ — на неделю. Если день в другом месяце,
// переключаем календарь на него. Даты вне границ выбора не выбираются — фокус остаётся на месте.
// Слушаем в фазе перехвата и дальше не пускаем: меню vuepic по стрелкам листает месяцы.
const DAY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
const toCellId = (date: Date) =>
  `dp-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Ячейка дня текущего месяца (не соседнего, .dp__cell_offset) по дате; у vuepic data-test-id = dp-yyyy-MM-dd.
function findDayCell(date: Date) {
  const items = rootRef.value?.querySelectorAll<HTMLElement>(`.dp__calendar_item[data-test-id="${toCellId(date)}"]`)
  return Array.from(items ?? []).find((item) => !item.querySelector('.dp__cell_offset'))
}

// Esc в любом месте календаря (и в сетке месяцев) закрывает его целиком и возвращает фокус в поле.
// У vuepic Esc в сетке месяцев только возвращает к датам, причём фокус теряется.
function closeMenuToInput(event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
  pickerRef.value?.closeMenu()
  rootRef.value?.querySelector<HTMLInputElement>('.dp__input')?.focus()
}

// Кнопка возврата к календарю внизу сетки месяцев: после неё фокус на 1-е число, как после выбора месяца.
const isBackToCalendarButton = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest('.dp__overlay_action'))

function handleCalendarClick(event: MouseEvent) {
  if (isBackToCalendarButton(event.target)) holdFocus(findFirstDay)
}

function handleCalendarKeydown(event: KeyboardEvent) {
  const item = event.target as HTMLElement
  if (event.key === 'Escape' && item.closest?.('.dp__menu')) return closeMenuToInput(event)
  if ((event.key === 'Enter' || event.key === ' ') && isBackToCalendarButton(item)) {
    holdFocus(findFirstDay)
    return
  }

  const step = DAY_STEPS[event.key]
  if (!step || !item.matches?.('.dp__calendar_item')) return

  event.preventDefault()
  event.stopPropagation()

  const match = /^dp-(\d{4})-(\d{2})-(\d{2})$/.exec(item.dataset.testId ?? '')
  if (!match) return
  const [, y, m, d] = match.map(Number) as [number, number, number, number]
  const next = new Date(y, m - 1, d + step)

  const { min, max } = bounds.value
  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (next < startOfDay(min) || next > startOfDay(max)) return

  const cell = findDayCell(next)
  if (cell) {
    cell.focus()
    return
  }
  pickerRef.value?.setMonthYear({ month: next.getMonth(), year: next.getFullYear() })
  holdFocus(() => findDayCell(next))
}

// Сетка месяцев открывается первой (flow): фокус на выбранный месяц, иначе текущий, иначе первый доступный.
const MONTH_FOCUS_TARGETS = [
  '.FieldDate-MonthCell_active:not(:disabled)',
  '.FieldDate-MonthCell_current:not(:disabled)',
  '.FieldDate-MonthCell:not(:disabled)',
]
let lastMonthGrid: HTMLElement | null = null
// Функциональный ref Vue вызывает и при перерисовках — реагируем только на новую сетку.
function registerMonthGrid(element: Element | ComponentPublicInstance | null) {
  if (!(element instanceof HTMLElement) || element === lastMonthGrid) return
  lastMonthGrid = element
  holdFocus(() =>
    element.isConnected
      ? MONTH_FOCUS_TARGETS.map((selector) => element.querySelector<HTMLElement>(selector)).find(Boolean)
      : null,
  )
}

// Первый доступный день показанного месяца (дни соседних месяцев — .dp__cell_offset).
const rootRef = ref<HTMLElement | null>(null)
function findFirstDay() {
  const items = rootRef.value?.querySelectorAll<HTMLElement>('.dp__calendar_item') ?? []
  return Array.from(items).find((item) => {
    const cell = item.querySelector('.dp__cell_inner')
    return cell && !cell.classList.contains('dp__cell_offset') && !cell.classList.contains('dp__cell_disabled')
  })
}

// Стрелки по сетке месяцев (3 колонки): ←/→ — соседний месяц, ↑/↓ — на ряд, Home/End — первый/последний.
// Недоступные месяцы пропускаем. Клавиши не пускаем дальше: меню vuepic по ним листает дни календаря.
const MONTH_GRID_COLUMNS = 3
const MONTH_GRID_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -MONTH_GRID_COLUMNS,
  ArrowDown: MONTH_GRID_COLUMNS,
}
function handleMonthGridKeydown(event: KeyboardEvent) {
  const grid = event.currentTarget as HTMLElement
  const cells = Array.from(grid.querySelectorAll<HTMLButtonElement>('.FieldDate-MonthCell'))
  const index = cells.indexOf(event.target as HTMLButtonElement)
  if (index < 0) return

  let target: HTMLButtonElement | undefined
  if (event.key === 'Home') target = cells.find((cell) => !cell.disabled)
  else if (event.key === 'End') target = [...cells].reverse().find((cell) => !cell.disabled)
  else {
    const step = MONTH_GRID_STEPS[event.key]
    if (!step) return
    for (let next = index + step; next >= 0 && next < cells.length; next += step) {
      if (!cells[next]!.disabled) {
        target = cells[next]
        break
      }
    }
  }

  event.preventDefault()
  event.stopPropagation()
  target?.focus()
}

// Название месяца в шапке меняется с той же анимацией, что и дни: vuepic листает дни переходами
// calendar-next / calendar-prev (их стили — в main.css vuepic), берём их же. Направление определяем
// по событию update-month-year: оно приходит раньше, чем перерисуется название.
const monthTransition = ref<'calendar-next' | 'calendar-prev'>('calendar-next')
let shownMonthIndex: number | null = null
function handleMonthYearUpdate({ month, year: shownYear }: { month: number; year: number }) {
  if (Number.isNaN(month)) return
  const index = shownYear * 12 + month
  if (shownMonthIndex !== null && index !== shownMonthIndex) {
    monthTransition.value = index > shownMonthIndex ? 'calendar-next' : 'calendar-prev'
  }
  shownMonthIndex = index
}

// Пустой календарь открываем на последнем доступном месяце, а не на текущем.
const startDate = computed(() => bounds.value.max)
const hasValue = computed(() => Boolean(modelValue))

const classList = computed(() => ({
  FieldDate_keyboardNavigation: keyboardNavigation.value,
  FieldDate_empty: !hasValue.value,
  FieldDate_filled: hasValue.value,
  FieldDate_disabled: disabled,
  FieldDate_noSeparator: !separator,
}))
</script>

<template>
  <label
    ref="rootRef"
    class="FieldDate"
    :class="classList"
    @keydown="handleKeydown"
    @keydown.capture="handleCalendarKeydown"
    @click.capture="handleCalendarClick"
    @focusin="handleFocusIn"
  >
    <span class="FieldDate-Label u-typo-body-small-m">
      <span class="FieldDate-LabelText">{{ label }}</span>
    </span>

    <VueDatePicker
      ref="pickerRef"
      class="FieldDate-Picker u-typo-body-m"
      :model-value="modelValue"
      :input-attrs="inputAttrs"
      :year-range="yearRange"
      :min-date="bounds.min"
      :max-date="bounds.max"
      :start-date="startDate"
      prevent-min-max-navigation
      :floating="{ arrow: false }"
      :flow="{ steps: ['month', 'calendar'], partial: true }"
      disable-year-select
      :placeholder="placeholder"
      :disabled="disabled"
      :locale="dateFnsLocale"
      model-type="yyyy-MM-dd"
      format="dd.MM.yyyy"
      :formats="{ input: 'dd.MM.yyyy', month: 'LLLL' }"
      :ui="{ input: 'FieldDate-Input u-typo-body-m', menu: 'FieldDate-Menu' }"
      :time-config="{ enableTimePicker: false }"
      auto-apply
      @update:model-value="handleUpdate"
      @update-month-year="handleMonthYearUpdate"
    >
      <!-- Кнопка месяца в шапке календаря: типографика v2. Месяц полностью (формат LLLL).
           Кнопки года нет (disable-year-select): год переключается стрелками. -->
      <template #month="{ text }">
        <!-- Старое и новое название лежат в одной ячейке сетки и анимируются одновременно, как дни -->
        <span class="FieldDate-MonthTitle">
          <Transition :name="monthTransition">
            <span :key="text" class="FieldDate-MonthTitleText u-typo-button-l u-uppercase">{{ text }}</span>
          </Transition>
        </span>
      </template>
      <!-- Типографика сетки: дни недели — label-m, числа — label-s -->
      <template #calendar-header="{ day }">
        <span class="u-typo-label-m">{{ capitalize(day) }}</span>
      </template>
      <template #day="{ day }">
        <span class="u-typo-label-s">{{ day }}</span>
      </template>
      <!-- Выбор месяца: своя сетка. Кнопка возврата к календарю внизу — от vuepic, с нашей иконкой (#calendar-icon) -->
      <template #month-overlay="{ items, year: overlayYear, updateMonthYear, toggle }">
        <div class="FieldDate-MonthOverlay">
          <div :ref="registerMonthGrid" class="FieldDate-MonthGrid" role="grid" @keydown="handleMonthGridKeydown">
            <button
              v-for="item in items"
              :key="item.value"
              type="button"
              role="gridcell"
              class="FieldDate-MonthCell u-typo-label-s"
              :class="{
                'FieldDate-MonthCell_active': isMonthSelected(item.value, overlayYear),
                'FieldDate-MonthCell_current': isCurrentMonth(item.value, overlayYear),
              }"
              :aria-selected="isMonthSelected(item.value, overlayYear)"
              :disabled="isMonthDisabled(item.value, overlayYear)"
              @click="selectMonth(item.value, overlayYear, updateMonthYear, toggle)"
            >
              {{ item.text }}
            </button>
          </div>
        </div>
      </template>
      <!-- Стрелки переключения месяца — иконки v2 вместо шевронов vuepic -->
      <template #arrow-left>
        <IconArrowLeft size="l" />
      </template>
      <template #arrow-right>
        <IconArrowRight size="l" />
      </template>
      <template #calendar-icon>
        <IconCalendar size="l" />
      </template>
      <template #input-icon>
        <IconCalendar class="FieldDate-Icon" />
      </template>
      <template #clear-icon="{ clear }">
        <!-- appear: vuepic монтирует слот, когда появляется значение, — анимируем появление как в FieldBase -->
        <Transition name="field-icon" appear>
          <button class="FieldDate-Clear" type="button" :aria-label="t('ui.common.clearField')" @click.stop="clear">
            <IconClose />
          </button>
        </Transition>
      </template>
    </VueDatePicker>
  </label>
</template>

<style scoped lang="scss">
// Палитра и состояния повторяют FieldBase, чтобы поле даты выглядело как остальные поля v2.
.FieldDate {
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

  --color-icons: var(--neutral-600);
  --color-icons-hover: var(--neutral-700);
  --color-icons-focus: var(--neutral-700);

  --box-shadow-icons-focus-tab: 0px 0px 0px 3px #5a636466;
  --box-shadow-input-focus-tab: 0px 0px 0px 3px #f5c96a99;
  // Фокус кнопок календаря (дни, месяцы, стрелки, кнопка месяца) — как у поля.
  --box-shadow-cell-focus-tab: 0px 0px 0px 3px #f5c96a99;

  --color-label-default: var(--neutral-900);
}

.FieldDate_empty {
  --field-border: var(--color-border-empty);
  --field-border-hover: var(--color-border-empty-hover);
  --field-border-focus: var(--color-border-empty-focus);
  --field-border-focus-tab: var(--color-border-empty-focus-tab);
  --field-border-disabled: var(--color-border-empty-disabled);
}

.FieldDate_filled {
  --field-border: var(--color-border-filled);
  --field-border-hover: var(--color-border-filled-hover);
  --field-border-focus: var(--color-border-filled-focus);
  --field-border-focus-tab: var(--color-border-filled-focus-tab);
  --field-border-disabled: var(--color-border-filled-disabled);
}

.FieldDate-Label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-label-default);
}

.FieldDate-LabelText {
  flex: 1 1 auto;
}

// Иконки внутри поля: календарь и очистка.
.FieldDate-Clear,
.FieldDate :deep(.dp__input_icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-icons);
  transition: color var(--transition-color);

  &:hover {
    color: var(--color-icons-hover);
  }
}

.FieldDate-Clear {
  &:focus {
    outline: none;
    color: var(--color-icons-focus);
  }

  .FieldDate_keyboardNavigation &:focus {
    box-shadow: var(--box-shadow-icons-focus-tab);
  }
}

.FieldDate-Clear {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  // Как в FieldBase: крестик виден только при наведении на поле или фокусе внутри него.
  opacity: var(--clear-opacity, 0);
  transform: scale(var(--clear-scale, 0.85));
  pointer-events: var(--clear-pointer-events, none);
  transition:
    color var(--transition-color),
    opacity var(--transition-color),
    transform var(--transition-color);
}

.FieldDate :deep(.dp__input_wrap:hover),
.FieldDate :deep(.dp__input_wrap:focus-within) {
  --clear-opacity: 1;
  --clear-scale: 1;
  --clear-pointer-events: auto;
}

.field-icon-enter-active,
.field-icon-leave-active {
  transition:
    color var(--transition-color),
    opacity var(--transition-color),
    transform var(--transition-color);
}

.field-icon-enter-from,
.field-icon-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.field-icon-leave-active {
  pointer-events: none;
}

// Иконка календаря не перехватывает мышь: она лежит поверх поля, и клик проходит прямо в input —
// работает так же, как клик по полю. Подсветка иконки при наведении — по наведению на поле.
.FieldDate :deep(.dp__input_icon) {
  inset-inline-start: 16px;
  pointer-events: none;
}

.FieldDate :deep(.dp__input_wrap:hover .dp__input_icon) {
  color: var(--color-icons-hover);
}

// Обёртка кнопки очистки от vuepic по умолчанию прижата к правому краю — ставим отступ 16px, как у FieldBase.
.FieldDate :deep(.dp--clear-btn) {
  inset-inline-end: 16px;
}

// Переменные vuepic объявлены на .dp__theme_light, поэтому переопределяем их там же (для календаря).
.FieldDate :deep(.dp__theme_light) {
  --dp-font-family: inherit;
  --dp-background-color: var(--white);
  --dp-text-color: var(--neutral-900);
  --dp-hover-color: var(--neutral-100);
  --dp-hover-text-color: var(--neutral-900);
  --dp-hover-icon-color: var(--neutral-700);
  --dp-primary-color: var(--blue-400);
  --dp-primary-disabled-color: var(--blue-200);
  --dp-primary-text-color: var(--white);
  --dp-secondary-color: var(--neutral-500);
  --dp-menu-border-color: var(--neutral-300);
  --dp-disabled-color: var(--neutral-100);
  --dp-disabled-color-text: var(--neutral-500);
  --dp-icon-color: var(--color-icons);
  --dp-highlight-color: var(--blue-100);
  // vuepic задаёт размер иконок стрелок сам: подгоняем под IconArrowLeft/Right size="l" (22px).
  --dp-button-icon-height: 22px;
  --dp-month-year-row-button-size: 32px;
  // Шапка с месяцем и стрелками (.dp--header-wrap) высотой 48px — высоту задаёт строка внутри неё.
  --dp-month-year-row-height: 48px;
  // Кнопка возврата к календарю внизу выбора месяца (.dp__button) высотой 48px.
  --dp-button-height: 48px;
  // Внутренний отступ меню (.dp__menu_inner).
  --dp-menu-padding: 16px;
  // Ячейки дней 40×40 со скруглением 12px.
  --dp-cell-size: 40px;
  --dp-cell-border-radius: 12px;
  // Строки недель вплотную друг к другу (у vuepic по умолчанию 5px сверху и снизу).
  --dp-row-margin: 0;
}

// Инпут — как FieldBase_Control. Селекторы с .dp__input перебивают стили vuepic
// (его рамки и тени при hover/focus).
.FieldDate :deep(.dp__input.FieldDate-Input) {
  min-height: 48px;
  // 16px отступ + 24px иконка + 12px зазор, как у FieldBase.
  padding: 0 52px;
  background: var(--color-background-default);
  border: 1px solid var(--field-border);
  border-radius: 24px;
  box-shadow: none;
  color: var(--color-text-default);
  font: inherit;
  transition:
    background-color var(--transition-color),
    border-color var(--transition-color),
    box-shadow var(--transition-color),
    color var(--transition-color);

  &::placeholder {
    color: var(--color-text-placeholder);
    opacity: 1;
  }

  &:hover {
    border-color: var(--field-border-hover);
  }

  &:focus,
  &.dp__input_focus {
    border-color: var(--field-border-focus);
  }
}

// Тень фокуса — только при навигации с клавиатуры.
.FieldDate_keyboardNavigation :deep(.dp__input.FieldDate-Input:focus) {
  border-color: var(--field-border-focus-tab);
  box-shadow: var(--box-shadow-input-focus-tab);
}

// Строка шапки: отступ 5px снизу под кнопкой месяца (высотой 48px) — итого 53px.
// Высоту строки отпускаем, чтобы отступ не сжимал кнопку.
.FieldDate :deep(.dp--header-wrap) {
  height: auto;
  margin-bottom: 5px;
}

// Название месяца: старое и новое на время анимации накладываются в одной ячейке.
.FieldDate-MonthTitle {
  display: grid;
}

.FieldDate-MonthTitleText {
  grid-area: 1 / 1;
}

// Кнопка месяца в шапке — со скруглением 12px, как ячейки дней и месяцев.
.FieldDate :deep(.dp__month_year_select) {
  border-radius: 12px;
}

// Плавная смена фона у кнопок календаря: дни, стрелки, кнопка месяца и кнопка возврата к календарю.
// У vuepic transition задан только на :hover (и не у всех), поэтому фон появляется плавно,
// а пропадает рывком. Задаём transition на базовом состоянии — анимируется в обе стороны.
.FieldDate :deep(.dp__cell_inner),
.FieldDate :deep(.dp__inner_nav),
.FieldDate :deep(.dp__month_year_select),
.FieldDate :deep(.dp__button) {
  transition:
    background-color var(--transition-color),
    border-color var(--transition-color),
    box-shadow var(--transition-color),
    color var(--transition-color);
}

// Отступ между шапкой с месяцем и днями недели.
.FieldDate :deep(.dp__calendar_header) {
  padding-top: 8px;
}

// Свой разделитель vuepic рисует между днями недели и числами — он не нужен.
.FieldDate :deep(.dp__calendar_header_separator) {
  display: none;
}

// Линия между шапкой с месяцем и днями недели — в виде DividerBase. Слота для неё у vuepic нет,
// поэтому рисуем её псевдоэлементом обёртки шапки и накладываем маской форму из DividerBase.
// При изменении DividerBase обновить path здесь.
.FieldDate :deep(.dp--header-wrap)::after {
  content: '';
  height: 3px;
  // Отступ от шапки с месяцем.
  margin-top: 6px;
  background: var(--divider-color, var(--neutral-300));
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 592 3' preserveAspectRatio='none'%3E%3Cpath d='M0 1.5C0 1.22329 0.462191 0.998439 1.03494 0.996504L296 0L590.965 0.996504C591.538 0.998439 592 1.22329 592 1.5C592 1.77671 591.538 2.00156 590.965 2.0035L296 3L1.03494 2.0035C0.462189 2.00156 0 1.77671 0 1.5Z'/%3E%3C/svg%3E")
    center / 100% 100% no-repeat;
}

.FieldDate_noSeparator :deep(.dp--header-wrap)::after {
  display: none;
}

// Оверлей выбора месяца: сетка 3 колонки, кнопки 98×48 (сжимаются, если меню уже).
// Сетка занимает всю высоту оверлея (её считает vuepic), строки распределены равномерно.
.FieldDate-MonthOverlay {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.FieldDate-MonthGrid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 98px));
  justify-content: space-between;
  align-content: space-between;
  // Минимальный зазор между колонками: в узком меню колонки сжимаются (minmax) и иначе слипаются.
  column-gap: 2px;
  row-gap: 8px;
  width: 100%;
}

.FieldDate-MonthCell {
  height: 48px;
  padding: 0 4px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--neutral-900);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color var(--transition-color),
    color var(--transition-color),
    box-shadow var(--transition-color);

  &:hover:not(:disabled) {
    background: var(--neutral-100);
  }

  &:focus {
    outline: none;
  }

  .FieldDate_keyboardNavigation &:focus {
    box-shadow: var(--box-shadow-cell-focus-tab);
  }

  &:disabled {
    color: var(--neutral-400);
    cursor: not-allowed;
  }
}

.FieldDate-MonthCell_current {
  // Как сегодняшний день у vuepic (.dp__today): рамка основного цвета.
  border: 1px solid var(--blue-400);
}

.FieldDate-MonthCell_active {
  background: var(--blue-400);
  color: var(--white);

  &:hover:not(:disabled) {
    background: var(--blue-300);
  }
}

// Выбранный день при наведении — светлее, как выбранный месяц.
.FieldDate :deep(.dp__active_date:hover) {
  background: var(--blue-300);
  color: var(--white);
}

// Недоступные дни (вне границ выбора): серый текст на светло-сером фоне, без реакции на наведение.
.FieldDate :deep(.dp__cell_disabled),
.FieldDate :deep(.dp__cell_disabled:hover) {
  /*  background: var(--neutral-100);*/
  color: var(--neutral-200);
}

// Фокус в календаре. Фокус получают обёртки (.dp__calendar_item у дня, .dp--arrow-btn-nav у стрелки),
// а фон и скругление — у внутренних элементов, поэтому тень рисуем на них.
// Свой outline у vuepic и браузера убираем всегда; тень — только при навигации с клавиатуры.
.FieldDate :deep(.dp__calendar_item:focus),
.FieldDate :deep(.dp--arrow-btn-nav:focus),
.FieldDate :deep(.dp__month_year_select:focus),
.FieldDate :deep(.dp__button:focus) {
  outline: none;
}

.FieldDate_keyboardNavigation :deep(.dp__calendar_item:focus .dp__cell_inner),
.FieldDate_keyboardNavigation :deep(.dp--arrow-btn-nav:focus .dp__inner_nav),
.FieldDate_keyboardNavigation :deep(.dp__month_year_select:focus) {
  box-shadow: var(--box-shadow-cell-focus-tab);
}

// Кнопка возврата к календарю во всю ширину у нижнего края меню: внешнюю тень обрезает
// overflow меню (видна одна грань), поэтому у неё тень внутрь.
.FieldDate_keyboardNavigation :deep(.dp__button:focus) {
  box-shadow: inset var(--box-shadow-cell-focus-tab);
}

// Кнопка прижата к низу меню, а у vuepic её нижние углы скруглены на --dp-border-radius (4px),
// тогда как меню скруглено на 16px: углы тени срезались скруглением меню. Повторяем скругление
// меню за вычетом его рамки (1px).
.FieldDate :deep(.dp__button_bottom) {
  border-radius: 0 0 15px 15px;
}

// Фон при фокусе с клавиатуры — как при наведении. Недоступные дни и стрелки не подсвечиваем.
.FieldDate_keyboardNavigation :deep(.dp__calendar_item:focus .dp__cell_inner:not(.dp__cell_disabled)),
.FieldDate_keyboardNavigation :deep(.dp--arrow-btn-nav:focus .dp__inner_nav:not(.dp__inner_nav_disabled)),
.FieldDate_keyboardNavigation :deep(.dp__month_year_select:focus),
.FieldDate_keyboardNavigation :deep(.dp__button:focus),
.FieldDate_keyboardNavigation .FieldDate-MonthCell:focus:not(:disabled) {
  background: var(--neutral-100);
}

// Выбранные день и месяц при фокусе — светлее, как при наведении.
.FieldDate_keyboardNavigation :deep(.dp__calendar_item:focus .dp__cell_inner.dp__active_date),
.FieldDate_keyboardNavigation .FieldDate-MonthCell_active:focus:not(:disabled) {
  background: var(--blue-300);
  color: var(--white);
}

.FieldDate :deep(.FieldDate-Menu) {
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #c5cecf80;
  overflow: hidden;
}

// Ограничения взаимодействия идут последними и имеют приоритет над hover/focus.
.FieldDate_disabled :deep(.dp__input.FieldDate-Input) {
  background: var(--color-background-disabled);
  border-color: var(--field-border-disabled);
  box-shadow: none;
  color: var(--color-text-disabled);
  cursor: not-allowed;

  &::placeholder {
    color: var(--color-text-placeholder-disabled);
  }
}

.FieldDate_disabled :deep(.dp__input_icon) {
  cursor: not-allowed;
}
</style>
