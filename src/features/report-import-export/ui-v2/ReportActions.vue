<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createReportExportFile, parseImportedReportState, type ReportState, useReportStore } from '@/entities/report'
import { ROUTES } from '@/shared/constants/routes.ts'
import { useLocale } from '@/shared/i18n'
import { DialogAlert } from '@/shared/ui/dialog-alert'
import { DialogConfirm } from '@/shared/ui/dialog-confirm'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { IconDownload, IconEye, IconUpload } from '@/shared/ui-v2/icons'

type Prop = { nonImport?: boolean }

const { nonImport } = defineProps<Prop>()

const router = useRouter()
const { t } = useLocale()
const reportStore = useReportStore()

const useShortLabels = ref(false)
const iconsOnly = ref(false)
const useSmallButtons = ref(false)
let shortLabelsQuery: MediaQueryList | undefined
let iconsOnlyQuery: MediaQueryList | undefined
let smallButtonsQuery: MediaQueryList | undefined

function updateActionLabels() {
  useShortLabels.value = shortLabelsQuery?.matches ?? false
  iconsOnly.value = iconsOnlyQuery?.matches ?? false
  useSmallButtons.value = smallButtonsQuery?.matches ?? false
}

onMounted(() => {
  shortLabelsQuery = window.matchMedia('(max-width: 768px)')
  iconsOnlyQuery = window.matchMedia('(max-width: 550px)')
  smallButtonsQuery = window.matchMedia('(width < 768px)')
  shortLabelsQuery.addEventListener('change', updateActionLabels)
  iconsOnlyQuery.addEventListener('change', updateActionLabels)
  smallButtonsQuery.addEventListener('change', updateActionLabels)
  updateActionLabels()
})

onUnmounted(() => {
  shortLabelsQuery?.removeEventListener('change', updateActionLabels)
  iconsOnlyQuery?.removeEventListener('change', updateActionLabels)
  smallButtonsQuery?.removeEventListener('change', updateActionLabels)
})

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
  return `kpo-book-${today}.json`
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
  <div class="ReportActions" :class="{ ReportActions_iconsOnly: iconsOnly }">
    <ButtonWithIcon
      class="ReportActions-Preview"
      :size="useSmallButtons ? 'm' : 'l'"
      :icon="IconEye"
      variant="accent"
      @click="router.push({ name: ROUTES.reportPreview.name })"
    >
      {{ t('ui.reportBuilderActions.preview') }}
    </ButtonWithIcon>
    <ButtonWithIcon
      class="ReportActions-Export"
      :icon="IconUpload"
      :size="useSmallButtons ? 'm' : 'l'"
      :aria-label="t('ui.reportBuilderActions.export')"
      @click="handleExport"
      :disabled="nonImport"
    >
      <template v-if="!iconsOnly" #default>
        {{ t(useShortLabels ? 'ui.reportBuilderActions.exportShort' : 'ui.reportBuilderActions.export') }}
      </template>
    </ButtonWithIcon>
    <ButtonWithIcon
      class="ReportActions-Import"
      :icon="IconDownload"
      :size="useSmallButtons ? 'm' : 'l'"
      :aria-label="t('ui.reportBuilderActions.import')"
      @click="openImportDialog"
    >
      <template v-if="!iconsOnly" #default>
        {{ t(useShortLabels ? 'ui.reportBuilderActions.importShort' : 'ui.reportBuilderActions.import') }}
      </template>
    </ButtonWithIcon>
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

.ReportActions-Preview {
  margin-right: auto;
}

.ReportActions_iconsOnly {
  flex-wrap: nowrap;
}

.ReportActions_iconsOnly .ReportActions-Export {
  order: 0;
  flex-shrink: 0;
}

.ReportActions_iconsOnly .ReportActions-Preview {
  order: 1;
  flex: 1;
  min-width: 0;
  margin-right: 0;
}

.ReportActions_iconsOnly .ReportActions-Import {
  order: 2;
  flex-shrink: 0;
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
