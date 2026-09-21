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
    class="IconMenu"
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
      d="M8 11.5C8.27614 11.5 8.5 11.7239 8.5 12C8.5 12.2762 8.27614 12.5 8 12.5C7.72386 12.5 7.5 12.2762 7.5 12C7.5 11.7239 7.72386 11.5 8 11.5ZM12 11.5C12.2761 11.5 12.5 11.7239 12.5 12C12.5 12.2762 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2762 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5ZM16 11.5C16.2761 11.5 16.5 11.7239 16.5 12C16.5 12.2762 16.2761 12.5 16 12.5C15.7239 12.5 15.5 12.2762 15.5 12C15.5 11.7239 15.7239 11.5 16 11.5Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
    />
    <path
      d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
      stroke="currentColor"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
