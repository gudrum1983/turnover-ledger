<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { parseImportedReportState, type ReportState, useReportStore } from '@/entities/report'
import { ROUTES } from '@/shared/constants/routes.ts'
import { useLocale } from '@/shared/i18n'
import { DialogConfirm } from '@/shared/ui-v2/dialog-confirm'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { IconDownload, IconEye, IconUpload } from '@/shared/ui-v2/icons'
import ReportExportDialog from './ReportExportDialog.vue'
import ReportImportDialog from './ReportImportDialog.vue'

type Prop = {
  /** Дополнительно отключает экспорт отчёта. */
  nonExport?: boolean
}

const { nonExport = false } = defineProps<Prop>()

const router = useRouter()
const { t } = useLocale()
const reportStore = useReportStore()
const isExportDisabled = computed(() => nonExport || reportStore.rows.length === 0)

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
const isExportDialogOpen = ref(false)
const isImportErrorDialogOpen = ref(false)
const isImportDialogOpen = ref(false)
const pendingImportState = ref<ReportState | null>(null)
const pendingImportFileName = ref('')
// Имя файла, который не удалось прочитать, — для текста ошибки.
const invalidFileName = ref('')

function resetFileInput() {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function openExportDialog() {
  if (isExportDisabled.value) return
  isExportDialogOpen.value = true
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
    isImportDialogOpen.value = true
  } catch {
    pendingImportState.value = null
    pendingImportFileName.value = ''
    invalidFileName.value = file.name
    isImportErrorDialogOpen.value = true
  } finally {
    resetFileInput()
  }
}

// «Повторить» — закрываем ошибку и сразу снова открываем выбор файла.
function retryImport() {
  isImportErrorDialogOpen.value = false
  openImportDialog()
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
      @click="openExportDialog"
      :disabled="isExportDisabled"
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
  <DialogConfirm
    v-model:open="isImportErrorDialogOpen"
    type="error"
    :title="t('ui.dataTransferModal.errorTitle')"
    :message="t('ui.dataTransferModal.errorMessage', { name: invalidFileName })"
    :details="t('ui.dataTransferModal.errorDetails')"
    :label-primary-button="t('ui.dataTransferModal.retry')"
    :label-secondary-button="t('ui.dataTransferModal.close')"
    @confirm="retryImport"
  />
  <ReportExportDialog v-model:open="isExportDialogOpen" />
  <ReportImportDialog
    v-model:open="isImportDialogOpen"
    :imported-state="pendingImportState"
    :file-name="pendingImportFileName"
  />
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
</style>
