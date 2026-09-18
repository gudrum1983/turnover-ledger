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
    class="IconRepeat"
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
      d="M9.5 19H9C6.62126 19 4.51881 17.8134 3.25478 16M2 12C2 8.13401 5.13401 5 9 5H11L9 3M14.5 5H15C17.3787 5 19.4812 6.18658 20.7453 8M22 12C22 15.866 18.866 19 15 19H13L15 21"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
