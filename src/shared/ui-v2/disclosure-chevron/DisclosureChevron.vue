<script setup lang="ts">
import { IconArrowDown } from '@/shared/ui-v2/icons'
import type { IconSize } from '@/shared/ui-v2/icons/sizes'

const { open = false, size = 'xl' } = defineProps<{
  /** В раскрытом состоянии шеврон направлен вверх. */
  open?: boolean
  size?: IconSize
}>()
</script>

<template>
  <IconArrowDown class="DisclosureChevron" :class="{ DisclosureChevron_open: open }" :size="size" />
</template>

<style scoped lang="scss">
.DisclosureChevron {
  flex-shrink: 0;
  transition: transform var(--transition-color);
}

.DisclosureChevron_open {
  transform: scaleY(-1);
}

@media (prefers-reduced-motion: reduce) {
  .DisclosureChevron {
    transition: none;
  }
}
</style>
