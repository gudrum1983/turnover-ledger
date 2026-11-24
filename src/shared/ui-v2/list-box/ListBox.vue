<script setup lang="ts">
import { computed, nextTick, ref, useSlots, watch } from 'vue'
import type { ListBoxOption } from './types'
import { DividerBase } from '@/shared/ui-v2/divider-base'
import { TooltipBase } from '@/shared/ui-v2/tooltip-base'

interface Props {
  /** Варианты значений */
  options: ListBoxOption[]
  /** Выбранное значение из списка */
  modelValue?: string
  /** Избранные значения для отображения вверху списка (строки из options.value) */
  favorites?: string[]
  /** Визуальный фокус при управлении с клавиатуры. */
  activeValue?: string
  optionIdPrefix?: string
}

const props = defineProps<Props>()
// Пробел задаём строкой: пробелы в шаблоне Vue схлопывает.
const DESCRIPTION_SEPARATOR = ' '
const listRef = ref<HTMLElement | null>(null)

function scrollToSelected() {
  const list = listRef.value
  const selected =
    list?.querySelector<HTMLElement>('[data-active="true"]') ??
    list?.querySelector<HTMLElement>('[aria-selected="true"]')
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

// Тултип с полным текстом пункта, если текст обрезан многоточием. Список прокручивается и обрезает
// всё, что выходит за его края, поэтому тултип выносим в body (Teleport) и ставим position: fixed.
const TOOLTIP_GAP = 4
const TOOLTIP_VIEWPORT_GAP = 18
// Сдвиг вправо, чтобы текст тултипа начинался там же, где текст пункта: отступ пункта 16px − отступ TooltipBase 8px.
const TOOLTIP_TEXT_OFFSET = 8
// Если над пунктом меньше места, тултип показываем под ним.
const TOOLTIP_MIN_SPACE_ABOVE = 64
type ItemTooltip = { text: string; left: number; top: number; below: boolean }
const tooltip = ref<ItemTooltip | null>(null)

function showTooltip(item: Element | null | undefined) {
  const text = item?.querySelector<HTMLElement>('.ListBox_ItemText')
  if (!item || !text || text.scrollWidth <= text.clientWidth) {
    tooltip.value = null
    return
  }
  const rect = item.getBoundingClientRect()
  const below = rect.top < TOOLTIP_MIN_SPACE_ABOVE
  tooltip.value = {
    text: text.textContent?.trim() ?? '',
    left: Math.max(TOOLTIP_VIEWPORT_GAP, rect.left + TOOLTIP_TEXT_OFFSET),
    top: below ? rect.bottom + TOOLTIP_GAP : rect.top - TOOLTIP_GAP,
    below,
  }
}

function hideTooltip() {
  tooltip.value = null
}

// При выборе стрелками тултип — у подсвеченного пункта (после прокрутки к нему).
watch(
  () => props.activeValue,
  async (value) => {
    await nextTick()
    showTooltip(value === undefined ? null : listRef.value?.querySelector('[data-active="true"]'))
  },
)

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

const slots = useSlots()
const hasFavoritesDivider = computed(() => favoriteOptions.value.length > 0 && otherOptions.value.length > 0)
// Есть разделитель — список становится выше на его высоту с отступами (см. --list-box-divider-space).
const hasDivider = computed(() => hasFavoritesDivider.value || Boolean(slots.footer))

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
  <div class="ListBox" :class="{ ListBox_withDivider: hasDivider }" role="listbox">
    <div ref="listRef" class="ListBox_List" tabindex="-1" @scroll="hideTooltip">
      <button
        v-for="option in favoriteOptions"
        :key="option.value"
        :id="optionIdPrefix ? `${optionIdPrefix}-option-${options.indexOf(option)}` : undefined"
        :tabindex="optionIdPrefix ? -1 : undefined"
        :data-active="activeValue === option.value"
        class="ListBox_Item u-typo-body-m"
        :class="{
          ListBox_Item_selected: option.value === modelValue,
          ListBox_Item_focused: activeValue === option.value,
        }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
        @mouseenter="showTooltip($event.currentTarget as Element)"
        @mouseleave="hideTooltip"
      >
        <span class="ListBox_ItemText"
          >{{ option.label
          }}<span v-if="option.description" class="ListBox_ItemDescription">{{
            DESCRIPTION_SEPARATOR + option.description
          }}</span></span
        >
      </button>
      <DividerBase v-if="hasFavoritesDivider" class="ListBox-Divider" />
      <button
        v-for="option in otherOptions"
        :key="option.value"
        :id="optionIdPrefix ? `${optionIdPrefix}-option-${options.indexOf(option)}` : undefined"
        :tabindex="optionIdPrefix ? -1 : undefined"
        :data-active="activeValue === option.value"
        class="ListBox_Item u-typo-body-m"
        :class="{
          ListBox_Item_selected: option.value === modelValue,
          ListBox_Item_focused: activeValue === option.value,
        }"
        type="button"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="handleSelect(option.value)"
        @mouseenter="showTooltip($event.currentTarget as Element)"
        @mouseleave="hideTooltip"
      >
        <span class="ListBox_ItemText"
          >{{ option.label
          }}<span v-if="option.description" class="ListBox_ItemDescription">{{
            DESCRIPTION_SEPARATOR + option.description
          }}</span></span
        >
      </button>
      <!-- Строка после пунктов (например, «Ещё»), внутри прокрутки. -->
      <!-- Разделитель в списке не больше одного: если он уже есть после избранных, перед строкой его не ставим. -->
      <template v-if="$slots.footer">
        <DividerBase v-if="!hasFavoritesDivider" class="ListBox-Divider" />
        <slot name="footer" />
      </template>
    </div>
    <Teleport to="body">
      <Transition name="list-box-tooltip">
        <div
          v-if="tooltip"
          :key="tooltip.text"
          class="ListBox-Tooltip"
          :class="{ 'ListBox-Tooltip_below': tooltip.below }"
          :style="{ left: `${tooltip.left}px`, top: `${tooltip.top}px` }"
          aria-hidden="true"
        >
          <TooltipBase :max-width="320">{{ tooltip.text }}</TooltipBase>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.ListBox {
  // Сколько добавить к max-height списка, чтобы разделитель не съедал место пунктов:
  // высота разделителя (3px) + gap списка (2px). Используется в max-height у ButtonDropdown и FieldCombobox.
  --list-box-divider-space: 0px;

  display: flex;
  padding: 4px;
  border-radius: 16px;
  background: var(--color-background-surface);
  /*box-shadow: var(--shadow);*/
  color: var(--color-text-default);
  width: 100%;
  border: 1px solid #d5dfe2;
  box-shadow: var(--shadow-dropdown);

  &_List {
    padding: 4px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &_withDivider {
    --list-box-divider-space: 5px;
  }

  // Отступы по краям, как у edge-offset в разделителе v1.
  &-Divider {
    width: auto;
    margin-inline: 5px;
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

    // Длинный текст (например, название валюты с курсом) обрезаем многоточием.
    .ListBox_ItemText {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ListBox_ItemDescription {
      color: var(--neutral-600);
      transition: all var(--transition);
    }

    &:hover {
      background: var(--neutral-100);
    }

    &_focused {
      background: var(--neutral-100);
      box-shadow: 0 0 0 3px #f5c96a99;
    }

    &:active {
      background: var(--blue-600);
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

      &:hover {
        background: var(--blue-300);
      }

      &.ListBox_Item_focused {
        background: var(--blue-300);
        box-shadow: 0 0 0 3px #f5c96a99;
      }

      &:active {
        background: var(--blue-100);
        color: var(--neutral-900);
        .ListBox_ItemDescription {
          color: var(--neutral-900);
        }
      }
    }
  }
}

// Полный текст обрезанного пункта. Выше модалки (z-index 1000), над пунктом, с задержкой как у тултипов полей.
.ListBox-Tooltip {
  position: fixed;
  z-index: 1100;
  max-width: calc(100vw - 36px);
  pointer-events: none;
  transform: translateY(-100%);

  // Кончик — у самого TooltipBase (как в TooltipWrapper), а не у обёртки: иначе тень TooltipBase ложится
  // поверх кончика и он выглядит светлее. isolation — чтобы кончик с z-index: -1 рисовался после фона
  // и тени TooltipBase, но под текстом. Цвет наследуется от TooltipBase.
  :deep(.TooltipBase) {
    isolation: isolate;

    // Кончик у левого края, смотрит на пункт.
    &::after {
      content: '';
      position: absolute;
      left: 16px;
      bottom: -4px;
      width: 8px;
      height: 8px;
      z-index: -1;
      background: inherit;
      border-radius: 0 0 2px 0;
      transform: rotate(45deg);
    }
  }
}

.ListBox-Tooltip_below {
  transform: none;

  :deep(.TooltipBase)::after {
    top: -4px;
    bottom: auto;
    border-radius: 2px 0 0 0;
  }
}

.list-box-tooltip-enter-active {
  transition: opacity var(--transition-color);
  transition-delay: var(--transition-delay-tooltip-enter);
}

.list-box-tooltip-enter-from {
  opacity: 0;
}
</style>
