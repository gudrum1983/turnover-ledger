<script setup lang="ts">
import { computed } from 'vue'

import { ICON_SIZES, type IconSize } from './sizes'

const { size = 'xl' } = defineProps<{
  /** Размер иконки: s — 16 px, m — 18 px, l — 22 px, xl — 24 px. */
  size?: IconSize
}>()

const iconSize = computed(() => ICON_SIZES[size])
</script>

<template>
  <svg
    class="IconRefresh"
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
      d="M12.5 3.01C12.36 3.003 12.22 3 12.079 3C7.44 3 3.68 6.73 3.68 11.333V13M3.68 13L2 11.333M3.68 13L5.36 11.333M16.5 4.247C17.62 4.94 18.57 5.88 19.2545 7"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
    <path
      d="M11.5 20.992C11.627 20.997 11.754 21 11.882 21C16.54 21 20.314 17.27 20.314 12.667V11M20.314 11L18.627 12.667M20.314 11L22 12.667M4.679 17C5.38 18.14 6.35 19.1 7.5 19.787"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
