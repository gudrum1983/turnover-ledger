<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  filterImportableRows,
  getReportYearCounts,
  hasReportMeta,
  mergeReportState,
  type ReportState,
  useReportStore,
} from '@/entities/report'
import { useLocale } from '@/shared/i18n'
import { getImportYearItems } from '../model/importYears'
import { useYearLabels } from '../model/useYearLabels'
import ReportDataTransferModal from './ReportDataTransferModal.vue'

const { importedState, fileName } = defineProps<{
  /** Разобранные данные из файла */
  importedState: ReportState | null
  /** Имя выбранного файла */
  fileName: string
}>()

const open = defineModel<boolean>('open', { required: true })

const { t } = useLocale()
const { yearLabel, skippedRowsText, importSummary } = useYearLabels()
const reportStore = useReportStore()

// В импорт идут только записи с датой, которую можно ввести в таблицу (с 2020 года и не позже сегодня).
// Остальные отбрасываем и пишем, сколько их.
const importable = computed(() => (importedState ? filterImportableRows(importedState) : null))

// Годы из файла: «2026 - 16 записей (… RSD)» — количество и сумма из файла. Годы только из книги не показываем.
const yearItems = computed(() =>
  getImportYearItems(
    getReportYearCounts(reportStore.rows),
    importable.value ? getReportYearCounts(importable.value.state.rows) : [],
  ),
)
const items = computed(() =>
  yearItems.value.map((item) => ({ year: item.year, label: yearLabel(item.year, item.inFile, item.rsdCents) })),
)
const hasYearsToImport = computed(() => yearItems.value.length > 0)
const warnings = computed(() => {
  if (!hasYearsToImport.value) return [t('ui.dataTransferModal.importNoYears')]
  const skippedCount = importable.value?.skippedCount ?? 0
  return skippedCount > 0 ? [skippedRowsText(skippedCount)] : []
})
const isMetaEmpty = computed(() => !importedState || !hasReportMeta(importedState.meta))
const hasBookMeta = computed(() => hasReportMeta(reportStore.exportState().meta))
const selectedYears = ref<number[]>([])
const includeMeta = ref(false)

// При каждом открытии отмечено всё, что есть в файле.
watch(open, (value) => {
  if (!value) return
  selectedYears.value = yearItems.value.map(({ year }) => year)
  includeMeta.value = !isMetaEmpty.value
})

// Итог по отмеченным галочкам: год, который уже есть в книге, заменится; которого нет — добавится.
const summary = computed(() => {
  const selected = yearItems.value.filter((item) => selectedYears.value.includes(item.year))
  const meta = includeMeta.value ? (hasBookMeta.value ? 'replace' : 'add') : null
  return importSummary(
    selected.filter((item) => item.current > 0).map(({ year }) => year),
    selected.filter((item) => item.current === 0).map(({ year }) => year),
    meta,
  )
})

function handleImport() {
  if (!importable.value || (selectedYears.value.length === 0 && !includeMeta.value)) return
  const nextState = mergeReportState(reportStore.exportState(), importable.value.state, {
    years: selectedYears.value,
    meta: includeMeta.value,
  })
  reportStore.replaceState(nextState)
  open.value = false
}
</script>

<template>
  <ReportDataTransferModal
    v-model:open="open"
    v-model:years="selectedYears"
    v-model:meta="includeMeta"
    :title="t('ui.dataTransferModal.importTitle')"
    :file-name="fileName"
    :subtitle="t('ui.dataTransferModal.importSubtitle')"
    :warnings="warnings"
    :summary="summary"
    :meta-label="t('ui.dataTransferModal.meta')"
    :confirm-label="t('ui.dataTransferModal.importConfirm')"
    :items="items"
    :meta-disabled="isMetaEmpty"
    @confirm="handleImport"
  />
</template>
