<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createReportExportFile, parseImportedReportState, type ReportState, useReportStore } from '@/entities/report'
import { ROUTES } from '@/shared/constants/routes.ts'
import { useLocale } from '@/shared/i18n'
import { DialogAlert } from '@/shared/ui/dialog-alert'
import { ButtonBase } from '@/shared/ui/button-base'
import { DialogConfirm } from '@/shared/ui/dialog-confirm'
import { IconExport, IconImport, IconPreview } from '@/shared/ui/icons'

const router = useRouter()
const { t } = useLocale()
const reportStore = useReportStore()

const fileInput = ref<HTMLInputElement | null>(null)
const isImportErrorDialogOpen = ref(false)
const isImportConfirmOpen = ref(false)
const pendingImportState = ref<ReportState | null>(null)
const pendingImportFileName = ref('')

const importRowsSummary = computed(() => {
  if (!pendingImportState.value) return ''

  return `${t('ui.importDataModal.rowsInTable')}: ${pendingImportState.value.rows.length}`
})

const formatExportFileName = () => {
  const today = new Date().toISOString().slice(0, 10)
  return `turnover-ledger-${today}.json`
}

function resetFileInput() {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleExport() {
  const payload = JSON.stringify(createReportExportFile(reportStore.exportState()), null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = formatExportFileName()
  link.click()

  URL.revokeObjectURL(url)
}

function openImportDialog() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]

  if (!file) return

  try {
    const fileContent = await file.text()
    const parsed = JSON.parse(fileContent) as unknown
    const importedState = parseImportedReportState(parsed)

    if (!importedState) {
      throw new Error('invalid-report-state')
    }

    pendingImportState.value = importedState
    pendingImportFileName.value = file.name
    isImportConfirmOpen.value = true
  } catch {
    pendingImportState.value = null
    pendingImportFileName.value = ''
    isImportErrorDialogOpen.value = true
  } finally {
    resetFileInput()
  }
}

function closeImportErrorDialog() {
  isImportErrorDialogOpen.value = false
}

function closeImportConfirm() {
  isImportConfirmOpen.value = false
  pendingImportState.value = null
  pendingImportFileName.value = ''
}

function applyImport() {
  if (!pendingImportState.value) return

  reportStore.replaceState(pendingImportState.value)
  closeImportConfirm()
}
</script>

<template>
  <div class="ReportActions">
    <ButtonBase color="success" size="xs" @click="router.push({ name: ROUTES.reportPreview.name })">
      <template #icon><IconPreview style="width: 20px; height: 20px" /></template>
      {{ t('ui.reportBuilderActions.preview') }}
    </ButtonBase>
    <ButtonBase color="primary" size="xs" @click="handleExport">
      <template #icon><IconExport style="width: 20px; height: 20px" /></template>
      {{ t('ui.reportBuilderActions.export') }}</ButtonBase
    >
    <ButtonBase color="info" size="xs" @click="openImportDialog">
      <template #icon><IconImport style="width: 20px; height: 20px" /></template>
      {{ t('ui.reportBuilderActions.import') }}</ButtonBase
    >
    <input
      ref="fileInput"
      class="ReportActions_FileInput"
      type="file"
      accept="application/json,.json"
      @change="handleFileChange"
    />
  </div>
  <DialogAlert
    v-model:open="isImportErrorDialogOpen"
    type="danger"
    :title="t('ui.importDataModal.invalidFileTitle')"
    :message="t('ui.importDataModal.invalidFile')"
    :labelCloseButton="t('ui.importDataModal.close')"
    @update:open="closeImportErrorDialog"
  />
  <DialogConfirm
    v-model:open="isImportConfirmOpen"
    :title="t('ui.importDataModal.title')"
    :message="t('ui.importDataModal.description')"
    :labelActiveButton="t('ui.importDataModal.confirm')"
    :labelCancelButton="t('ui.importDataModal.cancel')"
    type="confirm"
    @confirm="applyImport"
    @cancel="closeImportConfirm"
  >
    <template v-if="pendingImportFileName" #content>
      <div class="ReportActions_ImportSummary">
        <div class="ReportActions_ImportFileName">
          {{ pendingImportFileName }}
        </div>
        <div v-if="importRowsSummary" class="ReportActions_ImportRows">
          {{ importRowsSummary }}
        </div>
      </div>
    </template>
  </DialogConfirm>
</template>

<style scoped>
.ReportActions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.ReportActions_FileInput {
  display: none;
}

.ReportActions_ImportSummary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ReportActions_ImportFileName {
  overflow-wrap: anywhere;
}

.ReportActions_ImportRows {
  white-space: nowrap;
}
</style>
