<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { TooltipBase } from '@/shared/ui-v2/tooltip-base'

const { open, errorMessage, hint, anchor } = defineProps<{
  open: boolean
  errorMessage?: string
  hint?: string
  anchor: HTMLElement | null
}>()

const tooltipRef = ref<HTMLElement | null>(null)
const visible = ref(false)
let visibilityTimer: ReturnType<typeof setTimeout> | undefined

function clearVisibilityTimer() {
  clearTimeout(visibilityTimer)
  visibilityTimer = undefined
}

function scheduleVisibility() {
  clearVisibilityTimer()
  if (open === visible.value || !tooltipRef.value) return

  const token = open ? '--transition-delay-tooltip-enter' : '--transition-delay-tooltip-leave'
  const value = getComputedStyle(tooltipRef.value).getPropertyValue(token).trim()
  const delay = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000)
  visibilityTimer = setTimeout(() => {
    visible.value = open
    visibilityTimer = undefined
  }, delay)
}

watch(() => open, scheduleVisibility)
const below = ref(true)
const gap = computed(() => (errorMessage ? 3 : 1))
const gapValue = computed(() => `${gap.value}px`)
const arrowBorderRadius = computed(() => (below.value ? '2px 0 0 0' : '0 0 2px 0'))
const VIEWPORT_GAP = 18
let resizeObserver: ResizeObserver | undefined

async function updatePlacement() {
  await nextTick()
  if (!open || !anchor || !tooltipRef.value) return
  const rect = anchor.getBoundingClientRect()
  const spaceBelow = window.innerHeight - VIEWPORT_GAP - rect.bottom - gap.value
  const spaceAbove = rect.top - VIEWPORT_GAP - gap.value
  below.value = spaceBelow >= tooltipRef.value.offsetHeight || spaceBelow >= spaceAbove
}

watch(() => [open, errorMessage, hint], updatePlacement)
watch(
  () => anchor,
  (element) => {
    resizeObserver?.disconnect()
    if (element) resizeObserver?.observe(element)
  },
)

onMounted(() => {
  scheduleVisibility()
  resizeObserver = new ResizeObserver(() => {
    void updatePlacement()
  })
  if (anchor) resizeObserver.observe(anchor)
  window.addEventListener('resize', updatePlacement)
  window.addEventListener('scroll', updatePlacement, true)
  void updatePlacement()
})

onBeforeUnmount(() => {
  clearVisibilityTimer()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updatePlacement)
  window.removeEventListener('scroll', updatePlacement, true)
})
</script>

<template>
  <span
    ref="tooltipRef"
    class="FieldTooltip"
    :class="{ FieldTooltip_open: visible, FieldTooltip_below: below, FieldTooltip_error: Boolean(errorMessage) }"
    role="tooltip"
    :aria-hidden="!visible"
  >
    <TooltipBase class="FieldTooltip-Body">
      <span v-if="errorMessage" class="FieldTooltip-Error u-typo-body-small-m">{{ errorMessage }}</span>
      <span v-if="hint" class="u-typo-body-small-m" :class="{ 'FieldTooltip-Hint': Boolean(errorMessage) }">{{
        hint
      }}</span>
    </TooltipBase>
  </span>
</template>

<style scoped lang="scss">
.FieldTooltip {
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  bottom: calc(100% + v-bind(gapValue));
  visibility: hidden;
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition:
    opacity var(--transition-color),
    transform var(--transition-color),
    visibility var(--transition-color);

  &::after {
    content: '';
    position: absolute;
    left: 28px;
    bottom: -4px;
    width: 8px;
    height: 8px;
    z-index: -1;
    background: var(--neutral-600);
    border-radius: v-bind(arrowBorderRadius);
    transform: translateX(-50%) rotate(45deg);
  }
}

.FieldTooltip-Body {
  background: var(--neutral-600);
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: max-content;
  min-width: min(56px, 100%);
  max-width: 100%;
}

.FieldTooltip_error {
  &::after {
    left: 50%;
  }
  .FieldTooltip-Body {
    margin-inline: auto;
  }
}

.FieldTooltip_below {
  top: calc(100% + v-bind(gapValue));
  bottom: auto;
  transform: translateY(-4px);

  &::after {
    top: -4px;
    bottom: auto;
  }
}

.FieldTooltip_open {
  pointer-events: auto;
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.FieldTooltip-Error {
  display: block;
  background: var(--red-200);
  color: var(--neutral-900);
  border-radius: 4px;
  border-left: 1px solid var(--red-500);
  padding: 2px 4px;
}

.FieldTooltip-Hint {
  display: block;
  padding: 2px 4px;
}

@media (prefers-reduced-motion: reduce) {
  .FieldTooltip {
    transition: none;
  }
}
</style>
