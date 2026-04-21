<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { type ReportRow } from '@/entities/report-row'
import { type ReportRowFormInitialValue, type ReportRowPayload, ReportRowEditForm } from '@/features/report-row-edit'
import { getTableTotals, useReportStore } from '@/entities/report'
import { formatMoney } from '@/shared/lib'
import { useLocale, useLocaleStore } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui/button-base'
import { DialogConfirm } from '@/shared/ui/dialog-confirm'
import { ModalBase } from '@/shared/ui/modal-base'
import { ReportRowsTable } from '@/widgets/report-rows-table'

const store = useReportStore()
const { rows } = storeToRefs(store)

const localeStore = useLocaleStore()
const { t } = useLocale()

const isFullTable = ref(true)
const totalLimitRsdCents = 6_000_000 * 100

const tableTotals = computed(() => getTableTotals(rows.value))
const displayTotalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: localeStore.currentLocale }))
const displayTotalLimitRsd = computed(() => formatMoney(totalLimitRsdCents, { locale: localeStore.currentLocale }))
const isTotalLimitExceeded = computed(() => tableTotals.value.rsdCents > totalLimitRsdCents)

type FormMode = 'create' | 'edit'

const open = ref(false)
const canSubmit = ref(false)
const formKey = ref(0)
const formMode = ref<FormMode>('create')
const editingRowId = ref<string | null>(null)
const formInitialValue = ref<ReportRowFormInitialValue | null>(null)
const openDialogConfirm = ref(false)

const modalTitle = computed(() =>
  formMode.value === 'edit' ? t('ui.reportRowForm.titleEdit') : t('ui.reportRowForm.titleAdd'),
)

const fromCents = (value: number | null | undefined) => (typeof value === 'number' ? value / 100 : null)

const mapRowToInitialValue = (row: ReportRow): ReportRowFormInitialValue => ({
  date: row.date,
  currency: row.currency,
  description: row.description,
  goodsAmount: fromCents(row.amounts.goods.foreignCents),
  servicesAmount: fromCents(row.amounts.services.foreignCents),
  goodsAmountRsd: fromCents(row.amounts.goods.rsdCents),
  servicesAmountRsd: fromCents(row.amounts.services.rsdCents),
  totalAmountRsd: fromCents(row.amounts.goods.rsdCents + row.amounts.services.rsdCents),
  exchangeRate: row.exchangeRate ?? null,
})

function openCreateModal(initialValue: ReportRowFormInitialValue | null = null) {
  formMode.value = 'create'
  editingRowId.value = null
  formInitialValue.value = initialValue
  canSubmit.value = false
  formKey.value += 1
  open.value = true
}

function openEditModal(rowId: string) {
  const row = store.getRowById(rowId)
  if (!row) return

  formMode.value = 'edit'
  editingRowId.value = row.id
  formInitialValue.value = mapRowToInitialValue(row)
  canSubmit.value = false
  formKey.value += 1
  open.value = true
}

function handleCopy(id: string) {
  const row = store.getRowById(id)
  if (!row) return
  openCreateModal(mapRowToInitialValue(row))
}

function handleRemove(id: string) {
  store.removeRowById(id)
}

function closeModal() {
  open.value = false
  canSubmit.value = false
  formMode.value = 'create'
  editingRowId.value = null
  formInitialValue.value = null
}

function closeDialogConfirm() {
  openDialogConfirm.value = false
}

function handleClearTable() {
  store.clearRows()
  closeDialogConfirm()
}

const toCents = (value: number) => Math.round(value * 100)

const createRowId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function onSubmit(payload: ReportRowPayload) {
  if (!payload.currency || !payload.date) return
  if (payload.goodsAmountRsd === null || payload.servicesAmountRsd === null) return

  const rowId = formMode.value === 'edit' && editingRowId.value ? editingRowId.value : createRowId()
  const row: ReportRow = {
    id: rowId,
    date: payload.date,
    description: payload.description,
    currency: payload.currency.toUpperCase(),
    exchangeRate: payload.exchangeRate,
    amounts: {
      goods: {
        foreignCents: toCents(payload.goodsAmount),
        rsdCents: toCents(payload.goodsAmountRsd),
      },
      services: {
        foreignCents: toCents(payload.servicesAmount),
        rsdCents: toCents(payload.servicesAmountRsd),
      },
    },
  }

  if (formMode.value === 'edit') {
    store.updateRowById(row.id, row)
  } else {
    store.addRow(row)
  }

  closeModal()
}
</script>

<template>
  <div class="ReportRowManage">
    <ReportRowsTable
      v-model:is-full-table="isFullTable"
      :rows="rows"
      :locale="localeStore.currentLocale"
      :report-title="t('ui.reportBuilderSections.incomeRecords')"
      :display-total-rsd="displayTotalRsd"
      :display-total-limit-rsd="displayTotalLimitRsd"
      :is-total-limit-exceeded="isTotalLimitExceeded"
      @add="openCreateModal()"
      @clear="openDialogConfirm = true"
      @edit="openEditModal"
      @copy="handleCopy"
      @remove="handleRemove"
    />

    <ModalBase v-model:open="open" shouldCloseOnEsc>
      <h2>{{ modalTitle }}</h2>
      <ReportRowEditForm
        :key="formKey"
        id="report-row-form"
        :initial-value="formInitialValue"
        @update:canSubmit="canSubmit = $event"
        @submit="onSubmit"
      />
      <template #actions>
        <ButtonBase size="md" @click="closeModal">{{ t('ui.reportRowForm.cancel') }}</ButtonBase>
        <ButtonBase color="primary" size="md" :disabled="!canSubmit" type="submit" form="report-row-form">
          {{ t('ui.reportRowForm.submit') }}
        </ButtonBase>
      </template>
    </ModalBase>

    <DialogConfirm
      v-model:open="openDialogConfirm"
      :title="t('ui.deleteAllRowsModal.title')"
      :message="t('ui.deleteAllRowsModal.description')"
      :labelActiveButton="t('ui.deleteAllRowsModal.confirm')"
      :labelCancelButton="t('ui.deleteAllRowsModal.cancel')"
      type="delete"
      @confirm="handleClearTable"
    />
  </div>
</template>
