<script setup lang="ts">
import { ReportMetaEditForm } from '@/features/report-meta-edit'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { ReportActions } from '@/features/report-import-export'
import { ReportRowManage } from '@/features/report-row-manage'

import { PaperBase } from '@/shared/ui/paper-base'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { useLocale } from '@/shared/i18n'

const { t } = useLocale()
</script>

<template>
  <div class="ReportBuilderPage">
    <AppHeader :msg="t('ui.appHeaderTitle')" class="ReportBuilderPage_Header">
      <template #controls>
        <LocaleSwitcher />
      </template>
    </AppHeader>
    <main class="ReportBuilderPage_Main Container">
      <PaperBase class="ReportBuilderPage_layout">
        <ReportActions />
        <ReportMetaEditForm />
        <ReportRowManage />
      </PaperBase>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.ReportBuilderPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .ReportBuilderPage_Main {
    flex: 1;
  }

  .ReportBuilderPage_layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
