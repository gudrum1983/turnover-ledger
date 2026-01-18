<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'
import IconLocation from '@/shared/ui/icons/IconLocation.vue'
</script>

<template>
  <div class="ReportActions">
    <BaseButton color="danger" size="sm">
      <IconLocation style="width: 20px; height: 20px" />
      Сформировать отчет
    </BaseButton>
    <BaseButton color="success" size="xs">Экспорт данных</BaseButton>
    <BaseButton color="primary">Импорт данных</BaseButton>
    <BaseButton color="primary" disabled>Импорт данных</BaseButton>
    <BaseButton color="warning" size="lg">warning</BaseButton>
    <BaseButton color="info" size="lg">primary</BaseButton>
    <BaseButton color="info" size="lg" isIconOnly>
      <template #icon>
        <IconLocation style="width: 28px; height: 28px" />
      </template>
      Сформировать отчет
    </BaseButton>

    <BaseButton color="danger" variant="outline" fullWidth>Сформировать отчет</BaseButton>
    <BaseButton color="success" variant="outline" full-width>Экспорт данных</BaseButton>
    <BaseButton color="primary" variant="outline">Импорт данных</BaseButton>
    <BaseButton color="warning" variant="outline" size="lg">warning</BaseButton>
    <BaseButton color="info" variant="outline" size="xs" disabled>primary</BaseButton>
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
  max-width: 380px;
}
</style>
