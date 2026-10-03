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
  --link-color: var(--blue-200);
  --link-color-hover: var(--blue-600);

  cursor: pointer;
  padding: 0;
  margin: 0;
  color: var(--link-color);
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
  }
}
</style>
