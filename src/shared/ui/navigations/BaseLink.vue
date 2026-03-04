<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Size = 'xs' | 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  to: RouteLocationRaw
  noPadding?: boolean
}

const { size = 'md', noPadding = false, to } = defineProps<Props>()
</script>

<template>
  <RouterLink :to="to" class="BaseLink" :class="[`BaseLink_size_${size}`, { BaseLink_noPadding: noPadding }]">
    <slot />
  </RouterLink>
</template>

<style scoped lang="scss">
.BaseLink {
  /*var size */
  --link-padding-inline: 12px;
  --link-padding-block: 8px;
  --link-font-size: var(--font-medium-text-base);
  --link-color: var(--color-text-link);
  --link-color-hover: var(--color-text-link-hovered);

  cursor: pointer;
  padding: var(--link-padding-block) var(--link-padding-inline);
  font: var(--link-font-size);
  color: var(--link-color);
  text-decoration: none;
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
    text-decoration: underline;
  }
}

.BaseLink_size {
  &_xs {
    --link-padding-block: 4px;
    --link-padding-inline: 8px;
    --link-font-size: var(--font-medium-text-sm);
  }

  &_sm {
    --link-padding-inline: 8px;
    --link-font-size: var(--font-medium-text-sm);
  }

  &_md {
    --link-padding-inline: 12px;
    --link-font-size: var(--font-medium-text-base);
  }

  &_lg {
    --link-padding-inline: 16px;
    --link-font-size: var(--font-medium-text-lg);
  }
}
.BaseLink_noPadding {
  --link-padding-inline: 0;
}
</style>
