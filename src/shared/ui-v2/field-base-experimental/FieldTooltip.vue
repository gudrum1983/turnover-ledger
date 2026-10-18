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
  resizeObserver = new ResizeObserver(() => {
    void updatePlacement()
  })
  if (anchor) resizeObserver.observe(anchor)
  window.addEventListener('resize', updatePlacement)
  window.addEventListener('scroll', updatePlacement, true)
  void updatePlacement()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updatePlacement)
  window.removeEventListener('scroll', updatePlacement, true)
})
</script>

<template>
  <span
    ref="tooltipRef"
    class="FieldTooltip"
    :class="{ FieldTooltip_open: open, FieldTooltip_below: below, FieldTooltip_error: Boolean(errorMessage) }"
    role="tooltip"
    :aria-hidden="!open"
  >
    <TooltipBase class="FieldTooltip-Body">
      <span v-if="errorMessage" class="FieldTooltip-Error">{{ errorMessage }}</span>
      <span v-if="hint" :class="{ 'FieldTooltip-Hint': Boolean(errorMessage) }">{{ hint }}</span>
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
    background: var(--neutral-600);
    border-radius: v-bind(arrowBorderRadius);
    transform: translateX(-50%) rotate(45deg);
  }
}

.FieldTooltip-Body {
  display: block;
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
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.FieldTooltip-Error {
  display: block;
  color: var(--red-200);
  border-left: 2px solid var(--red-500);
  padding-left: 8px;
}

.FieldTooltip-Hint {
  display: block;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .FieldTooltip {
    transition: none;
  }
}
</style>
