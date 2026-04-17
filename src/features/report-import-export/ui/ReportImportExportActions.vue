<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createReportExportFile, parseImportedReportState, type ReportState, useReportStore } from '@/entities/report'
import { ROUTES } from '@/shared/constants/routes.ts'
import { useLocale } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui/button-base'
import { DialogConfirm } from '@/shared/ui/dialog-confirm'
import { IconExport, IconImport, IconPreview } from '@/shared/ui/icons'

const router = useRouter()
const { t } = useLocale()
const reportStore = useReportStore()

const fileInput = ref<HTMLInputElement | null>(null)
const importError = ref('')
const isImportConfirmOpen = ref(false)
const pendingImportState = ref<ReportState | null>(null)
const pendingImportFileName = ref('')

const importFileSummary = computed(() => {
  if (!pendingImportState.value) return pendingImportFileName.value

  return `${pendingImportFileName.value} (${pendingImportState.value.rows.length})`
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
  importError.value = ''

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
  importError.value = ''
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
    importError.value = ''
  } catch {
    pendingImportState.value = null
    pendingImportFileName.value = ''
    importError.value = t('ui.importData.invalidFile')
  } finally {
    resetFileInput()
  }
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
  <div class="ReportImportExportActions">
    <ButtonBase color="success" size="xs" @click="router.push({ name: ROUTES.reportPreview.name })">
      <template #icon><IconPreview style="width: 20px; height: 20px" /></template>
      {{ t('ui.reportActions.preview') }}
    </ButtonBase>
    <ButtonBase color="primary" size="xs" @click="handleExport">
      <template #icon><IconExport style="width: 20px; height: 20px" /></template>
      {{ t('ui.reportActions.export') }}</ButtonBase
    >
    <ButtonBase color="info" size="xs" @click="openImportDialog">
      <template #icon><IconImport style="width: 20px; height: 20px" /></template>
      {{ t('ui.reportActions.import') }}</ButtonBase
    >
    <input
      ref="fileInput"
      class="ReportImportExportActions_FileInput"
      type="file"
      accept="application/json,.json"
      @change="handleFileChange"
    />
    <div v-if="importError" class="ReportImportExportActions_Error Typo_Caption">{{ importError }}</div>
  </div>
  <DialogConfirm
    v-model:open="isImportConfirmOpen"
    :title="t('ui.importData.title')"
    :message="t('ui.importData.description')"
    :labelActiveButton="t('ui.importData.confirm')"
    :labelCancelButton="t('ui.importData.cancel')"
    type="confirm"
    @confirm="applyImport"
    @cancel="closeImportConfirm"
  >
    <template v-if="importFileSummary" #content>
      {{ importFileSummary }}
    </template>
  </DialogConfirm>
</template>

<style scoped>
.ReportImportExportActions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.ReportImportExportActions_FileInput {
  display: none;
}

.ReportImportExportActions_Error {
  width: 100%;
  color: var(--color-text-danger);
}
</style>
