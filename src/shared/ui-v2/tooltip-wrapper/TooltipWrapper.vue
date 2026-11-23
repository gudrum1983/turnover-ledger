<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { TooltipBase } from '@/shared/ui-v2/tooltip-base'
import { toPxString } from '@/shared/lib/number'

type Props = {
  /** Текст подсказки, видимой при наведении или фокусе внутри обёртки. */
  text: string
  /** Текст ошибки: выводится над основным текстом выделенной плашкой, как в FieldTooltip. */
  errorText?: string
  /** Устаревший пропс: текущий TooltipBase не поддерживает размеры. */
  size?: 'sm' | 'md' | 'lg'
  /** Максимальная ширина подсказки в пикселях, передаваемая в TooltipBase. */
  maxWidth?: number
}

const { text, errorText, size = 'sm', maxWidth } = defineProps<Props>()

const VIEWPORT_GAP = 18

const tooltipRef = ref<InstanceType<typeof TooltipBase> | null>(null)
const horizontalShift = ref(0)
const isTooltipBelow = ref(false)

const horizontalShiftValue = computed(() => toPxString(horizontalShift.value))
const tooltipBottomValue = computed(() => (isTooltipBelow.value ? 'auto' : 'calc(100% + 8px)'))
const tooltipTopValue = computed(() => (isTooltipBelow.value ? 'calc(100% + 8px)' : 'auto'))
const tooltipOffsetValue = computed(() => (isTooltipBelow.value ? '-4px' : '4px'))
// Тултип у края экрана сдвигается, а кончик остаётся по центру триггера.
const arrowLeftValue = computed(() => `calc(50% - ${toPxString(horizontalShift.value)})`)
const arrowTopValue = computed(() => (isTooltipBelow.value ? '-4px' : 'auto'))
const arrowBottomValue = computed(() => (isTooltipBelow.value ? 'auto' : '-4px'))
const arrowBorderRadius = computed(() => (isTooltipBelow.value ? '2px 0 0 0' : '0 0 2px 0'))

async function updateTooltipPosition() {
  horizontalShift.value = 0
  isTooltipBelow.value = false

  await nextTick()

  const tooltipElement = tooltipRef.value?.$el as HTMLElement | undefined

  if (!tooltipElement) return

  const triggerRect = tooltipElement.parentElement?.getBoundingClientRect()
  if (!triggerRect) return

  if (triggerRect.top - tooltipElement.offsetHeight - 8 < VIEWPORT_GAP) {
    isTooltipBelow.value = true
  }

  // Размеры без transform, чтобы анимация не влияла на позиционирование.
  const tooltipLeft = triggerRect.left + (triggerRect.width - tooltipElement.offsetWidth) / 2
  const tooltipRight = tooltipLeft + tooltipElement.offsetWidth

  if (tooltipLeft < VIEWPORT_GAP) {
    horizontalShift.value = VIEWPORT_GAP - tooltipLeft
    return
  }

  if (tooltipRight > window.innerWidth - VIEWPORT_GAP) {
    horizontalShift.value = window.innerWidth - VIEWPORT_GAP - tooltipRight
  }
}

function handleViewportChange() {
  void updateTooltipPosition()
}

onMounted(() => {
  window.addEventListener('resize', handleViewportChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleViewportChange)
})
</script>

<template>
  <span class="TooltipWrapper" @mouseenter="updateTooltipPosition" @focusin="updateTooltipPosition">
    <slot />

    <TooltipBase
      ref="tooltipRef"
      class="TooltipWrapper_Tooltip u-typo-body-small-m"
      :class="{ TooltipWrapper_Tooltip_error: Boolean(errorText) }"
      :size="size"
      :max-width="maxWidth"
    >
      <template v-if="errorText">
        <span class="TooltipWrapper-Error">{{ errorText }}</span>
        <span v-if="text" class="TooltipWrapper-Text">{{ text }}</span>
      </template>
      <template v-else>{{ text }}</template>
    </TooltipBase>
  </span>
</template>

<style scoped lang="scss">
.TooltipWrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.TooltipWrapper_Tooltip {
  position: absolute;
  // Переносы строк из текста (\n) отображаются как есть.
  white-space: pre-line;
  z-index: 10;
  left: 50%;
  top: v-bind(tooltipTopValue);
  bottom: v-bind(tooltipBottomValue);
  transform: translateX(calc(-50% + v-bind(horizontalShiftValue))) translateY(v-bind(tooltipOffsetValue));
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity var(--transition-color),
    transform var(--transition-color),
    visibility 0s linear var(--transition-duration-hover);
}

// С ошибкой — ошибка и текст столбиком, как в FieldTooltip.
.TooltipWrapper_Tooltip_error {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.TooltipWrapper-Error {
  display: block;
  background: var(--red-200);
  color: var(--neutral-900);
  border-radius: 4px;
  border-left: 1px solid var(--red-500);
  padding: 2px 4px;
}

.TooltipWrapper-Text {
  display: block;
  padding: 2px 4px;
}

// Кончик тултипа. Цвет наследуется от TooltipBase, чтобы не дублировать его здесь.
.TooltipWrapper_Tooltip::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: v-bind(arrowLeftValue);
  top: v-bind(arrowTopValue);
  bottom: v-bind(arrowBottomValue);
  width: 8px;
  height: 8px;
  background: inherit;
  border-radius: v-bind(arrowBorderRadius);
  transform: translateX(-50%) rotate(45deg);
}

.TooltipWrapper:hover .TooltipWrapper_Tooltip,
.TooltipWrapper:focus-within .TooltipWrapper_Tooltip {
  visibility: visible;
  opacity: 1;
  transform: translateX(calc(-50% + v-bind(horizontalShiftValue))) translateY(0);
  transition-delay: 0s;
}
</style>
