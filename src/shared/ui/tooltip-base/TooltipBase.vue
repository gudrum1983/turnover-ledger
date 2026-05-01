<script setup lang="ts">
import { computed } from 'vue'
import { toPxString } from '@/shared/lib/number'

type Props = {
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: number
}

const { size = 'md', maxWidth } = defineProps<Props>()

const maxWidthValue = computed(() => (typeof maxWidth === 'number' ? toPxString(maxWidth, { min: 0 }) : 'max-content'))

const classes = computed(() => [`TooltipBase_size_${size}`])
</script>

<template>
  <div class="TooltipBase" :class="classes">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.TooltipBase {
  width: max-content;
  word-wrap: break-word;
  max-width: v-bind(maxWidthValue);
  color: var(--color-text-base);
  border-radius: 4px;
  background-color: var(--color-background-default-invert);
  box-shadow: var(--shadow-md);
  position: relative;
  padding: 4px 8px;
  font: var(--font-regular-text-sm);
}

.TooltipBase_size_sm {
  font: var(--font-regular-text-xs);
  padding: 2px 4px;
}

.TooltipBase_size_md {
  padding: 4px 8px;
  font: var(--font-regular-text-sm);
}

.TooltipBase_size_lg {
  padding: 6px 12px;
  font: var(--font-regular-text-base);
}
</style>
