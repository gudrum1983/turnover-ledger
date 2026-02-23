<script setup lang="ts">
import ReportDocument from '@/widgets/report-document/ui/ReportDocument.vue'
import AppHeader from '@/app/AppHeader.vue'
import { ROUTES } from '@/shared/constants/routes.ts'
import { BaseButton } from '@/shared/ui'
import router from '@/app/router'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale } from '@/shared/i18n'

const onPrint = () => {
  window.print()
}

const directionLandscape = ref<boolean>(false)
const { t } = useLocale()

function onCross() {
  directionLandscape.value = !directionLandscape.value
}

const labelButtonDirection = computed(() =>
  directionLandscape.value ? t('ui.reportPreview.landscape') : t('ui.reportPreview.portrait'),
)

const classes = computed(() => [{ ReportPreviewPage_Document_landscape: directionLandscape.value }])

const printStyleId = 'print-page-size'

const updatePrintPageStyle = (isLandscape: boolean) => {
  const existing = document.getElementById(printStyleId)
  const style = existing ?? document.createElement('style')
  style.id = printStyleId
  style.textContent = `@page { size: A4 ${isLandscape ? 'landscape' : 'portrait'}; margin: 15mm; }`
  if (!existing) {
    document.head.appendChild(style)
  }
}

onMounted(() => {
  updatePrintPageStyle(directionLandscape.value)
})

watch(directionLandscape, (value) => {
  updatePrintPageStyle(value)
})

onBeforeUnmount(() => {
  document.getElementById(printStyleId)?.remove()
})
</script>

<template>
  <div class="ReportPreviewPage">
    <AppHeader :msg="t('ui.app.reportPreviewTitle')" class="ReportPreviewPage_Header">
      <template v-slot:actionButtons>
        <BaseButton color="info" @click="onCross">
          {{ labelButtonDirection }}
        </BaseButton>
        <BaseButton color="default" variant="outline" @click="router.push({ name: ROUTES.reportBuilder.name })">
          {{ t('ui.reportPreview.toHome') }}
        </BaseButton>
        <BaseButton color="primary" variant="outline" @click="onPrint">{{ t('ui.reportPreview.print') }}</BaseButton>
      </template>
    </AppHeader>
    <section class="ReportPreviewPage_Document" :class="classes">
      <ReportDocument :landscape="directionLandscape" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.ReportPreviewPage {
  display: flex;
  flex-direction: column;
  align-items: center;

  &_Header {
    margin-block-start: 20px;
    margin-block-end: 40px;
  }

  &_Document {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;
    width: 210mm;
    height: fit-content;
    min-height: 297mm;
    padding: 15mm;
    background: white;

    &_landscape {
      width: 297mm;
      min-height: 210mm;
    }
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
