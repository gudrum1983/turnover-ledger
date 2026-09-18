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
    class="IconBack"
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
      d="M9.5 17L4.5 12L9.5 7M4.5 12L11 12M14.5 12C16.1667 12 19.5 13 19.5 17"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
