<script setup lang="ts">
import { ReportMetaEditForm } from '@/features/report-meta-edit'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { ReportActions } from '@/features/report-import-export'
import { ReportRowManage } from '@/features/report-row-manage'
import { PaperBlock } from '@/shared/ui-v2/paper-block'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { useLocale } from '@/shared/i18n'

const { t } = useLocale()
</script>

<template>
  <div class="ReportBuilderPage">
    <AppHeader
      :title="t('ui.appHeaderTitle')"
      subtitle="Учет доходов для паушальных налогоплательщиков"
      class="ReportBuilderPage_Header"
    >
      <template #controls>
        <LocaleSwitcher />
      </template>
    </AppHeader>
    <main class="ReportBuilderPage_Main u-container">
      <ReportActions nonImport />

      <PaperBlock variant="meta" class="ReportBuilderPage-Meta">
        <ReportMetaEditForm />
      </PaperBlock>

      <PaperBlock variant="default" class="ReportBuilderPage_layout">
        <ReportRowManage />
      </PaperBlock>
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
    padding-block: 40px;
  }

  &-Meta {
    margin-block: 40px;
  }

  .ReportBuilderPage_layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
