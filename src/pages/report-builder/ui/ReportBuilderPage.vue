<script setup lang="ts">
import { ReportBuilderMetaForm } from '@/features/report-meta-form'
import ReportActions from '../parts/ReportActions.vue'
import ReportTable from '../parts/ReportTable.vue'

import { PaperBase } from '@/shared/ui/paper-base'
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue'
import { useLocale } from '@/shared/i18n'

const { t } = useLocale()
</script>

<template>
  <div class="ReportBuilderPage">
    <AppHeader :msg="t('ui.app.reportBuilderTitle')" class="ReportBuilderPage_Header" />
    <main class="ReportBuilderPage_Main Container">
      <PaperBase class="ReportBuilderPage_layout">
        <ReportActions />
        <ReportBuilderMetaForm />
        <ReportTable />
      </PaperBase>
    </main>
  </div>
</template>

<style scoped lang="scss">
.ReportBuilderPage {
  .ReportBuilderPage_layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
