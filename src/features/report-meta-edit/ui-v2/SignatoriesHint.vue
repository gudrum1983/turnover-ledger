<script setup lang="ts">
import { IconCopy, IconPenCircle } from '@/shared/ui-v2/icons'

defineProps<{
  automatic: boolean
  text: string
}>()
</script>

<template>
  <span class="ReportMetaEditForm-SignatoriesHint u-typo-label-s">
    <IconCopy v-if="automatic" />
    <IconPenCircle v-else />
    {{ text }}
  </span>
</template>

<style scoped lang="scss">
.ReportMetaEditForm-SignatoriesHint {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  color: var(--neutral-700);
}

svg {
  flex-shrink: 0;
}
</style>
