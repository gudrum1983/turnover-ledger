<script setup lang="ts">
import { BaseButton, IconInput } from '@/shared/ui'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes.ts'
import { useLocale } from '@/shared/i18n'

const router = useRouter()
const { t } = useLocale()
</script>

<template>
  <div class="ReportActions">
    <!-- todo - пример как иконку использовать, переделать на актуальную кнопку -->
    <BaseButton color="success" size="xs" @click="router.push({ name: ROUTES.reportPreview.name })">
      <template #icon><IconInput style="width: 20px; height: 20px" /></template
      >{{ t('ui.reportActions.preview') }}</BaseButton
    >
    <BaseButton color="primary" size="xs">{{ t('ui.reportActions.export') }}</BaseButton>
    <BaseButton color="info" size="xs">{{ t('ui.reportActions.import') }}</BaseButton>
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
