<script setup lang="ts">
import { computed } from 'vue'
import { toPxString } from '@/shared/lib/number'

type Props = {
  maxWidth?: number
}

const { maxWidth } = defineProps<Props>()

const maxWidthValue = computed(() => (typeof maxWidth === 'number' ? toPxString(maxWidth, { min: 0 }) : 'max-content'))
</script>

<template>
  <div class="TooltipBase u-typo-body-small-m">
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
  background-color: var(--neutral-600);
  position: relative;
  padding: 4px 8px;
  box-shadow: 0 2px 8px 0 #c5cecf80;
}
</style>
