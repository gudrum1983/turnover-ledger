<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  createReportExportFile,
  getReportYearCounts,
  hasReportMeta,
  pickReportState,
  useReportStore,
} from '@/entities/report'
import { useLocale } from '@/shared/i18n'
import { useYearLabels } from '../model/useYearLabels'
import ReportDataTransferModal from './ReportDataTransferModal.vue'

const open = defineModel<boolean>('open', { required: true })

const { t } = useLocale()
const { exportLabel, metaExportLabel } = useYearLabels()
const reportStore = useReportStore()

const yearCounts = computed(() => getReportYearCounts(reportStore.rows))
const items = computed(() => yearCounts.value.map(({ year, count }) => ({ year, label: exportLabel(year, count) })))
const isMetaEmpty = computed(() => !hasReportMeta(reportStore.exportState().meta))
const metaLabel = computed(() => metaExportLabel(!isMetaEmpty.value))
const selectedYears = ref<number[]>([])
const includeMeta = ref(false)

// При каждом открытии отмечено всё, что есть.
watch(open, (value) => {
  if (!value) return
  selectedYears.value = yearCounts.value.map(({ year }) => year)
  includeMeta.value = !isMetaEmpty.value
})

const formatExportFileName = () => `kpo-book-${new Date().toISOString().slice(0, 10)}.json`

function downloadJson(data: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function handleExport() {
  if (selectedYears.value.length === 0 && !includeMeta.value) return
  // Все годы — выгружаем все записи целиком, вместе с записями без корректной даты.
  const isAllSelected = selectedYears.value.length === yearCounts.value.length
  const state = pickReportState(reportStore.exportState(), {
    years: isAllSelected ? 'all' : selectedYears.value,
    meta: includeMeta.value,
  })
  downloadJson(createReportExportFile(state), formatExportFileName())
  open.value = false
}
</script>

<template>
  <ReportDataTransferModal
    v-model:open="open"
    v-model:years="selectedYears"
    v-model:meta="includeMeta"
    :title="t('ui.dataTransferModal.exportTitle')"
    :subtitle="t('ui.dataTransferModal.exportSubtitle')"
    :confirm-label="t('ui.dataTransferModal.exportConfirm')"
    :items="items"
    :meta-label="metaLabel"
    :meta-disabled="isMetaEmpty"
    @confirm="handleExport"
  />
</template>
