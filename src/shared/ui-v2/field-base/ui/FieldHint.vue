<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { TooltipBase } from '@/shared/ui-v2/tooltip-base'
import { toPxString } from '@/shared/lib/number'
import { IconQuestion } from '@/shared/ui-v2/icons'

type Props = {
  text: string
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: number
}

const { text, size = 'sm', maxWidth } = defineProps<Props>()

const VIEWPORT_GAP = 18

const tooltipRef = ref<InstanceType<typeof TooltipBase> | null>(null)
const horizontalShift = ref(0)
const isTooltipBelow = ref(false)

const horizontalShiftValue = computed(() => toPxString(horizontalShift.value))
const tooltipBottomValue = computed(() => (isTooltipBelow.value ? 'auto' : 'calc(100% + 8px)'))
const tooltipTopValue = computed(() => (isTooltipBelow.value ? 'calc(100% + 8px)' : 'auto'))
const tooltipOffsetValue = computed(() => (isTooltipBelow.value ? '-4px' : '4px'))

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
  <span class="InfoHint" @mouseenter="updateTooltipPosition" @focusin="updateTooltipPosition">
    <button class="InfoHint_Trigger" type="button">
      <IconQuestion class="InfoHint_Icon" />
    </button>

    <TooltipBase ref="tooltipRef" class="InfoHint_Tooltip u-typo-body-small-m" :size="size" :max-width="maxWidth">
      {{ text }}
    </TooltipBase>
  </span>
</template>

<style scoped lang="scss">
.InfoHint {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.InfoHint_Trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: help;
}

.InfoHint_Icon {
  width: 24px;
  height: 24px;
}

.InfoHint_Tooltip {
  position: absolute;
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

.InfoHint:hover .InfoHint_Tooltip,
.InfoHint:focus-within .InfoHint_Tooltip {
  visibility: visible;
  opacity: 1;
  transform: translateX(calc(-50% + v-bind(horizontalShiftValue))) translateY(0);
  transition-delay: 0s;
}
</style>
