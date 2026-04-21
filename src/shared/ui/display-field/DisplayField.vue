<script setup lang="ts">
type DisplayFieldProps = {
  value?: string
  label?: string
}

const { value = '—', label } = defineProps<DisplayFieldProps>()
</script>

<template>
  <div class="DisplayField">
    <div class="ReportRowEditForm_Label">{{ label }}</div>
    <div class="ReportRowEditForm_Card">
      <div class="ReportRowEditForm_Value">{{ value }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportRowEditForm_Label {
  color: var(--color-text-disabled);
  font: var(--font-regular-text-sm);
}

.ReportRowEditForm_Card {
  height: fit-content;
  border: 1px dashed var(--color-border-default);
  background: var(--color-background-surface-accent);
  display: flex;
  flex-direction: row;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 4px;
  color: var(--color-text-default);
}
.ReportRowEditForm_Value {
  color: var(--color-text-default);
  font: var(--font-medium-text-sm);
  line-height: 1.15;
  word-break: break-word;
}
</style>
