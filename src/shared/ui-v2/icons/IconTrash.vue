<script setup lang="ts">
import { computed } from 'vue'

import { ICON_SIZES, type IconSize } from './sizes'

const { size = 'xl' } = defineProps<{
  size?: IconSize
}>()

const iconSize = computed(() => ICON_SIZES[size])
</script>

<template>
  <svg
    class="IconTrash"
    :width="iconSize.dimension"
    :height="iconSize.dimension"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="iconSize.strokeWidth"
    focusable="false"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.17188 4C9.58371 2.83481 10.695 2 12.0012 2C13.3074 2 14.4186 2.83481 14.8305 4"
      stroke="currentColor"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
    <path d="M20.5001 6H3.5" stroke="currentColor" stroke-linecap="round" vector-effect="non-scaling-stroke" />
    <path
      d="M18.3727 15.3991C18.1957 18.054 18.1073 19.3815 17.2422 20.1907C16.3772 21 15.0468 21 12.386 21H11.6127C8.95187 21 7.62146 21 6.75646 20.1907C5.89145 19.3815 5.80295 18.054 5.62596 15.3991L5.16602 8.5M18.8327 8.5L18.6327 11.5"
      stroke="currentColor"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
    <path d="M9.5 11L10 16" stroke="currentColor" stroke-linecap="round" vector-effect="non-scaling-stroke" />
    <path d="M14.5 11L14 16" stroke="currentColor" stroke-linecap="round" vector-effect="non-scaling-stroke" />
  </svg>
</template>
