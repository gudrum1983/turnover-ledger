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
    class="IconDangerCircle"
    :width="iconSize.dimension"
    :height="iconSize.dimension"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="iconSize.strokeWidth"
    focusable="false"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 7V13" stroke="currentColor" stroke-linecap="round" vector-effect="non-scaling-stroke" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="1" />
    <path
      d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
      stroke="currentColor"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
