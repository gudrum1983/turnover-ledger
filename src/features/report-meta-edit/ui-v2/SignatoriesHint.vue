<script setup lang="ts">
import { IconCheckCircle, IconPenCircle } from '@/shared/ui-v2/icons'

defineProps<{
  automatic: boolean
  text: string
}>()
</script>

<template>
  <span class="ReportMetaEditForm-SignatoriesHint u-typo-label-s">
    <IconCheckCircle v-if="automatic" />
    <IconPenCircle v-else />
    {{ text }}
  </span>
</template>

<style scoped lang="scss">
.ReportMetaEditForm-SignatoriesHint {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--neutral-700);
}

svg {
  flex-shrink: 0;
  color: var(--green-400);
}
</style>
