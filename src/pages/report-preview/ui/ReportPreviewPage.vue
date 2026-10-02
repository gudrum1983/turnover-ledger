<script setup lang="ts">
import { LocaleSwitcher } from '@/features/locale-switcher'
import { AppHeader } from '@/widgets/app-header'
import { ReportPreviewDocument } from '@/widgets/report-preview-document'
import { ROUTES } from '@/shared/constants/routes.ts'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { onBeforeUnmount } from 'vue'
import { useLocale } from '@/shared/i18n'
import { useReportScriptStore } from '@/entities/report-script'
import { storeToRefs } from 'pinia'
import { AppFooter } from '@/widgets/app-footer'
import { IconBack, IconPrinter } from '@/shared/ui-v2/icons'
import { useRouter } from 'vue-router'
import { ReportScriptSwitch } from '@/features/report-script-switch'

const onPrint = () => {
  window.print()
}
//todo: тут стили перешерстить и свитчер переместить
const router = useRouter()

function closePreview() {
  router.push({ name: ROUTES.reportBuilder.name })
}

const { t } = useLocale()
const reportScriptStore = useReportScriptStore()
const { script } = storeToRefs(reportScriptStore)

const printStyleId = 'print-page-size'

onBeforeUnmount(() => {
  document.getElementById(printStyleId)?.remove()
})
</script>

<template>
  <div class="ReportPreviewPage">
    <AppHeader
      :title="t('ui.appHeaderTitle')"
      subtitle="Учет доходов для паушальных налогоплательщиков"
      class="ReportBuilderPage_Header"
    >
      <template #controls>
        <LocaleSwitcher />
      </template>
      <template v-slot:actionButtons>
        <div class="ReportPreviewPage-Panel">
          <div class="ReportPreviewPage_Actions">
            <ButtonWithIcon :icon="IconBack" variant="accent" :onclick="closePreview">
              Закрыть предпросмотр
            </ButtonWithIcon>

            <ButtonWithIcon :icon="IconPrinter" variant="page" @click="onPrint">
              {{ t('ui.reportPreview.print') }}
            </ButtonWithIcon>
          </div>
          <ReportScriptSwitch class="ReportPreviewPage-Language no-print" v-model="script" />
        </div>
      </template>
    </AppHeader>
    <main class="ReportPreviewPage_Main">
      <section class="ReportPreviewPage_Document">
        <ReportPreviewDocument :script="script" />
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.ReportPreviewPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;

  &_Header {
    margin-block-end: 16px;
  }

  &-Language {
    align-items: center;
  }

  &_Actions {
    display: flex;
    padding: 40px 0;
    width: 100%;
    justify-content: space-between;
  }

  &-Panel {
    display: flex;
    flex-direction: column;
    padding: 8px 0 24px;
    width: 100%;
    justify-content: center;
  }

  &_Main {
    flex: 1;
    display: flex;
    width: 100%;
    justify-content: center;
  }

  &_PrintAction {
    display: flex;
    align-items: center;
    gap: 6px;
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
  .ReportPreviewPage_Main {
    display: block;
    width: 100%;
  }

  .ReportPreviewPage_Document {
    width: 100%;
    min-height: fit-content;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
