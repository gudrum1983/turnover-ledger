<script setup lang="ts">
import { computed } from 'vue'

const {
  label,
  size = 'medium',
  variant = 'default',
} = defineProps<{
  /** Текст тега */
  label: string
  /** Размер тега */
  size?: 'small' | 'medium'
  /** Визуальный вариант тега */
  variant?: 'default' | 'fill'
}>()

const classes = computed(() => {
  return {
    'TagBase_small u-typo-body-small-m': size === 'small',
    'u-typo-label-m': size === 'medium',
    TagBase_fill: variant === 'fill',
  }
})
</script>

<template>
  <div class="TagBase" :class="classes">
    {{ label }}
  </div>
</template>

<style scoped lang="scss">
.TagBase {
  border-radius: 16px;
  border: 1px solid var(--blue-200);
  box-sizing: border-box;
  padding: 8px 16px;
  text-transform: uppercase;
  width: fit-content;
  height: fit-content;
}

.TagBase_small {
  padding: 4px 8px;
}

.TagBase_fill {
  background: var(--neutral-100);
  border-color: var(--neutral-100);
}
</style>
