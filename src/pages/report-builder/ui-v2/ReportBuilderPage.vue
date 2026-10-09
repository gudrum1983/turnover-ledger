<script setup lang="ts">
import { PageLayout } from '@/shared/ui-v2/page-layout'
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
  <PageLayout class="ReportBuilderPage" main-class="ReportBuilderPage_Main u-container">
    <template #header>
      <AppHeader
        :title="t('ui.appHeaderTitle')"
        subtitle="Учет доходов для паушальных налогоплательщиков"
        class="ReportBuilderPage_Header"
      >
        <template #controls>
          <LocaleSwitcher />
        </template>
      </AppHeader>
    </template>

    <ReportActions nonImport />

    <PaperBlock variant="meta" class="ReportBuilderPage-Meta">
      <ReportMetaEditForm />
    </PaperBlock>

    <PaperBlock variant="default" class="ReportBuilderPage_layout">
      <ReportRowManage />
    </PaperBlock>

    <template #footer>
      <AppFooter />
    </template>
  </PageLayout>
</template>

<style scoped lang="scss">
.ReportBuilderPage {
  :deep(.ReportBuilderPage_Main) {
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
