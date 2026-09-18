<script setup lang="ts">
import { computed, useId } from 'vue'

import iconLoaderM from './IconLoaderM.svg?raw'
import iconLoaderS from './IconLoaderS.svg?raw'

const { size = 'm' } = defineProps<{
  size?: 's' | 'm'
}>()

const loaders = { s: iconLoaderS, m: iconLoaderM }
const id = useId()
// Уникальные ID предотвращают пересечение clip-path у нескольких лоадеров.
const loaderSvg = computed(() => loaders[size].replaceAll('paint0_angular_', `${id}-paint0_angular_`))
</script>

<template>
  <!-- Разметка SVG импортируется только из локальных файлов дизайнера. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span class="LoaderBase" aria-hidden="true" v-html="loaderSvg"></span>
</template>

<style scoped lang="scss">
.LoaderBase {
  display: inline-flex;
  flex-shrink: 0;
  vertical-align: middle;
  // 360deg / 24 steps = 15deg per step.
  animation: loaderRotate 1.1s steps(24, end) infinite;
}

@keyframes loaderRotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
