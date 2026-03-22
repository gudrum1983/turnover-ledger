<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Sizes } from '../../types'

type Props = {
  size?: Sizes
  to: RouteLocationRaw
}

const { size = 'md', to } = defineProps<Props>()

const sizeClass = `LinkBase_size_${size}`
</script>

<template>
  <RouterLink :to="to" class="LinkBase" :class="sizeClass">
    <slot />
  </RouterLink>
</template>

<style scoped lang="scss">
.LinkBase {
  /*var size */
  --link-font-size: var(--font-medium-text-base);
  --link-color: var(--color-text-link);
  --link-color-hover: var(--color-text-link-hovered);

  cursor: pointer;
  padding: 0;
  margin: 0;
  font: var(--link-font-size);
  color: var(--link-color);
  text-decoration: none;
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
    text-decoration: underline;
  }
}

.LinkBase_size {
  &_xs {
    --link-font-size: var(--font-medium-text-sm);
  }

  &_sm {
    --link-font-size: var(--font-medium-text-sm);
  }

  &_md {
    --link-font-size: var(--font-medium-text-base);
  }

  &_lg {
    --link-font-size: var(--font-medium-text-lg);
  }
}
</style>
