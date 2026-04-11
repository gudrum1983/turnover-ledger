<script setup lang="ts">
import { ReportBuilderMetaForm } from '@/features/report-meta-form'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { ReportImportExportActions } from '@/features/report-import-export'
import { ReportRowManage } from '@/features/report-row-manage'

import { PaperBase } from '@/shared/ui/paper-base'
import { AppHeader } from '@/widgets/app-header'
import { useLocale } from '@/shared/i18n'

const { t } = useLocale()
</script>

<template>
  <div class="ReportBuilderPage">
    <AppHeader :msg="t('ui.app.reportBuilderTitle')" class="ReportBuilderPage_Header">
      <template #controls>
        <LocaleSwitcher />
      </template>
    </AppHeader>
    <main class="ReportBuilderPage_Main Container">
      <PaperBase class="ReportBuilderPage_layout">
        <ReportImportExportActions />
        <ReportBuilderMetaForm />
        <ReportRowManage />
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
