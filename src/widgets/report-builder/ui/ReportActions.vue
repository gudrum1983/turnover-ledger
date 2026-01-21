<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'
import IconInput from '@/shared/ui/icons/IconInput.vue'
</script>

<template>
  <div class="ReportActions">
    <!-- todo - пример как иконку использовать, переделать на актуальную кнопку -->
    <BaseButton color="success" size="xs">
      <template #icon><IconInput style="width: 20px; height: 20px" /></template>PDF</BaseButton
    >
    <BaseButton color="primary" size="xs">Экспорт данных</BaseButton>
    <BaseButton color="info" size="xs">Импорт данных</BaseButton>
  </div>
</template>

<style scoped>
.ReportActions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding-block: 16px;
  width: 100%;
}
</style>
