<script setup lang="ts">
const { label } = defineProps<{ label: string }>()
</script>

<template>
  <div class="BaseTag">
    {{ label }}
  </div>
</template>

<style scoped>
.BaseTag {
  padding: 2px 6px;
  border-radius: 20px;
  color: var(--color-text-disabled);
  width: fit-content;
  height: fit-content;
  font: var(--font-medium-text-xs);
  border: 1px dashed var(--color-border-default);
}
</style>
