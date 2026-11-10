<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { type ReportRow } from '@/entities/report-row'
import { type ReportRowFormInitialValue, type ReportRowPayload, ReportRowEditForm } from '@/features/report-row-edit'
import { getTableTotals, useReportStore } from '@/entities/report'
import { formatMoney } from '@/shared/lib'
import { useLocale, useLocaleStore } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { DialogConfirm } from '@/shared/ui-v2/dialog-confirm'
import { ModalBase } from '@/shared/ui-v2/modal-base'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { IconAddCircle } from '@/shared/ui-v2/icons'
import { ReportYearSelect } from '@/features/report-year-select'
import { ReportRowsTable } from '@/widgets/report-rows-table'

const store = useReportStore()
// Конструктор работает с записями выбранного года: таблица, итог, лимит и очистка.
const { activeYearRows: rows, activeYear, hasUnsortedActiveYearRows } = storeToRefs(store)

const localeStore = useLocaleStore()
const { t } = useLocale()

// Вид таблицы (полная / краткая) запоминаем между сессиями. По умолчанию — краткая.
const TABLE_VIEW_STORAGE_KEY = 'reportRowsTableView'
const isFullTable = ref(false)

try {
  isFullTable.value = localStorage.getItem(TABLE_VIEW_STORAGE_KEY) === 'full'
} catch {
  // localStorage недоступен — остаёмся на краткой таблице.
}

watch(isFullTable, (isFull) => {
  try {
    localStorage.setItem(TABLE_VIEW_STORAGE_KEY, isFull ? 'full' : 'short')
  } catch {
    // localStorage недоступен — переключение работает без сохранения.
  }
})
const totalLimitRsdCents = 6_000_000 * 100

const tableTotals = computed(() => getTableTotals(rows.value))
const displayTotalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: localeStore.currentLocale }))
const displayTotalLimitRsd = computed(() => formatMoney(totalLimitRsdCents, { locale: localeStore.currentLocale }))
const isTotalLimitExceeded = computed(() => tableTotals.value.rsdCents > totalLimitRsdCents)

const clearYearMessage = computed(() => {
  const count = rows.value.length
  return t('ui.deleteYearRowsModal.summary', { count, amount: displayTotalRsd.value }, count)
})

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
  store.clearActiveYearRows()
  closeDialogConfirm()
}

function handleSortRows() {
  store.sortRowsByDate()
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
    <div class="ReportRowManage-Header">
      <h2 class="ReportRowManage-Title u-typo-h2-l">
        {{ t('ui.reportBuilderSections.incomeRecords') }}
      </h2>
      <ReportYearSelect size="middle" typography="button-l" placement="center" />

      <div v-if="rows.length < 1" class="ReportRowManage-Empty">
        <span class="u-typo-subtitle-l">{{
          t('ui.reportBuilderIncomeRecordsTable.emptyTitle', { year: activeYear })
        }}</span>
        <span class="ReportRowManage-EmptySubtitle u-typo-body-m">
          {{ t('ui.reportBuilderIncomeRecordsTable.emptySubtitle') }}
        </span>
        <ButtonWithIcon :icon="IconAddCircle" variant="accent" @click="openCreateModal()">
          {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
        </ButtonWithIcon>
      </div>
    </div>

    <ReportRowsTable
      v-if="rows.length"
      v-model:is-full-table="isFullTable"
      :rows="rows"
      :locale="localeStore.currentLocale"
      :report-title="t('ui.reportBuilderSections.incomeRecords')"
      :display-total-rsd="displayTotalRsd"
      :display-total-limit-rsd="displayTotalLimitRsd"
      :is-total-limit-exceeded="isTotalLimitExceeded"
      :has-unsorted-rows="hasUnsortedActiveYearRows"
      :has-rows-from-different-years="false"
      @add="openCreateModal()"
      @sort="handleSortRows"
      @clear="openDialogConfirm = true"
      @edit="openEditModal"
      @copy="handleCopy"
      @remove="handleRemove"
    />

    <ModalBase v-model:open="open" :title="modalTitle" shouldCloseOnEsc hasCloseButton>
      <ReportRowEditForm
        :key="formKey"
        id="report-row-form"
        :initial-value="formInitialValue"
        @update:canSubmit="canSubmit = $event"
        @submit="onSubmit"
      />
      <div class="ReportRowManage-ModalActions">
        <ButtonBase variant="page" size="m" @click="closeModal">{{ t('ui.reportRowForm.cancel') }}</ButtonBase>
        <ButtonBase variant="accent" size="m" :disabled="!canSubmit" type="submit" form="report-row-form">
          {{ t('ui.reportRowForm.submit') }}
        </ButtonBase>
      </div>
    </ModalBase>

    <DialogConfirm
      v-model:open="openDialogConfirm"
      :title="t('ui.deleteYearRowsModal.title', { year: activeYear })"
      :message="clearYearMessage"
      :details="t('ui.deleteYearRowsModal.description')"
      :labelActiveButton="t('ui.deleteYearRowsModal.confirm')"
      :labelCancelButton="t('ui.deleteYearRowsModal.cancel')"
      type="delete"
      @confirm="handleClearTable"
    />
  </div>
</template>

<style scoped lang="scss">
.ReportRowManage {
  padding-top: 32px;

  &-Header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-Title {
    margin-bottom: 8px;
  }

  &-Empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-block: 40px 32px;
  }

  &-EmptySubtitle {
    padding-block: 4px 24px;
    color: var(--neutral-600);
  }

  &-ModalActions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }
}
</style>
