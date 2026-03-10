<script setup lang="ts">
import ReportDocument from '@/widgets/report-document/ui/ReportDocument.vue'
import { ReportScriptToggle } from '@/widgets/report-preview/ui'
import AppHeader from '@/app/AppHeader.vue'
import { ROUTES } from '@/shared/constants/routes.ts'
import { BaseButton, BaseLink } from '@/shared/ui'
import { onBeforeUnmount } from 'vue'
import { useLocale } from '@/shared/i18n'
import { useReportScript } from '@/shared/lib'

const onPrint = () => {
  window.print()
}

const { t } = useLocale()
const { script } = useReportScript()

const printStyleId = 'print-page-size'

onBeforeUnmount(() => {
  document.getElementById(printStyleId)?.remove()
})
</script>

<template>
  <div class="ReportPreviewPage">
    <AppHeader :msg="t('ui.app.reportPreviewTitle')" class="ReportPreviewPage_Header">
      <template v-slot:actionButtons>
        <div class="ReportPreviewPage_Actions">
          <BaseLink :to="{ name: ROUTES.reportBuilder.name }" size="lg">🡄 {{ t('ui.reportPreview.toHome') }}</BaseLink>

          <ReportScriptToggle v-model="script" class="no-print" />

          <BaseButton size="xs" color="success" @click="onPrint">{{ t('ui.reportPreview.print') }}</BaseButton>
        </div>
      </template>
    </AppHeader>

    <section class="ReportPreviewPage_Document">
      <ReportDocument :script="script" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.ReportPreviewPage {
  display: flex;
  flex-direction: column;
  align-items: center;

  &_Header {
    margin-block-end: 16px;
  }

  &_Actions {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  &_Document {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;

    height: fit-content;

    padding: 15mm;
    background: white;

    width: 297mm;
    min-height: 210mm;
  }
}

@media print {
  .ReportPreviewPage_Document {
    width: 100%;
    min-height: fit-content;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
