<script setup lang="ts">
const { label } = defineProps<{
  /** Текст бейджа: короткая подпись к числу, например «+1 сегодня» */
  label: string
}>()
</script>

<template>
  <span class="BadgeBase u-typo-label-m">{{ label }}</span>
</template>

<style scoped lang="scss">
.BadgeBase {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--neutral-200);
  color: var(--neutral-700);
  white-space: nowrap;
}
</style>
