<script setup lang="ts">
type PointBaseProps = {
  /** Цвет маркера. Передайте currentColor для наследования цвета текста. */
  color?: string
}

const { color = 'var(--blue-600)' } = defineProps<PointBaseProps>()
</script>

<template>
  <svg class="PointBase" width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2.75" cy="2.75" r="2" :stroke="color" stroke-width="1.5" />
  </svg>
</template>

<style scoped>
.PointBase {
  display: inline-block;
  box-sizing: content-box;
  width: 6px;
  height: 6px;
  min-width: 6px;
  min-height: 6px;
  flex-shrink: 0;
}
</style>
