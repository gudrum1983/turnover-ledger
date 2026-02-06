<script setup lang="ts">
import { BaseButton, IconInput } from '@/shared/ui'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes.ts'

const router = useRouter()
</script>

<template>
  <div class="ReportActions">
    <!-- todo - пример как иконку использовать, переделать на актуальную кнопку -->
    <BaseButton color="success" size="xs" @click="router.push({ name: ROUTES.reportPreview.name })">
      <template #icon><IconInput style="width: 20px; height: 20px" /></template>Просмотр</BaseButton
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
  width: 100%;
}
</style>
