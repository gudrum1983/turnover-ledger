<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Props = {
  /** Маршрут или путь для перехода */
  to: RouteLocationRaw
}

const { to } = defineProps<Props>()
</script>

<template>
  <RouterLink :to="to" class="LinkBase">
    <slot />
  </RouterLink>
</template>

<style scoped lang="scss">
.LinkBase {
  --link-color: var(--blue-300);
  --link-color-hover: var(--blue-600);
  border-radius: 8px;
  padding: 2px 6px;
  cursor: pointer;
  margin: 0;
  color: var(--link-color);
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #c5cecf66;
    color: var(--link-color-hover);
  }
}
</style>
