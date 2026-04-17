<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { TooltipBase } from '@/shared/ui/tooltip-base'
import { IconInfo } from '@/shared/ui/icons'
import { toPxString } from '@/shared/lib/number'

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

async function updateTooltipPosition() {
  horizontalShift.value = 0
  isTooltipBelow.value = false

  await nextTick()

  const tooltipElement = tooltipRef.value?.$el as HTMLElement | undefined

  if (!tooltipElement) return

  const tooltipRect = tooltipElement.getBoundingClientRect()

  if (tooltipRect.top < VIEWPORT_GAP) {
    isTooltipBelow.value = true
    await nextTick()
  }

  const nextTooltipRect = tooltipElement.getBoundingClientRect()

  if (nextTooltipRect.left < VIEWPORT_GAP) {
    horizontalShift.value = VIEWPORT_GAP - nextTooltipRect.left
    return
  }

  if (nextTooltipRect.right > window.innerWidth - VIEWPORT_GAP) {
    horizontalShift.value = window.innerWidth - VIEWPORT_GAP - nextTooltipRect.right
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
      <IconInfo class="InfoHint_Icon" />
    </button>

    <TooltipBase ref="tooltipRef" class="InfoHint_Tooltip" :size="size" :max-width="maxWidth">
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
  color: var(--color-text-placeholder);
  cursor: help;

  &:hover {
    color: var(--color-text-info);
  }
}

.InfoHint_Icon {
  width: 16px;
  height: 16px;
}

.InfoHint_Tooltip {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: v-bind(tooltipTopValue);
  bottom: v-bind(tooltipBottomValue);
  transform: translateX(calc(-50% + v-bind(horizontalShiftValue)));
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity var(--transition),
    visibility var(--transition);
}

.InfoHint:hover .InfoHint_Tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
