<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { type ReportRow, ROW_HIGHLIGHT_DURATION_MS } from '@/entities/report-row'
import { type ReportRowFormInitialValue, type ReportRowPayload, ReportRowEditForm } from '@/features/report-row-edit'
import { getTableTotals, useReportStore } from '@/entities/report'
import { formatDateForUi, formatMoney, useViewport } from '@/shared/lib'
import { useLocale, useLocaleStore } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { DialogConfirm } from '@/shared/ui-v2/dialog-confirm'
import { ModalBase } from '@/shared/ui-v2/modal-base'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { IconAddCircle, IconTrash } from '@/shared/ui-v2/icons'
import { ButtonIcon } from '@/shared/ui-v2/button-icon'
import { LabelContainer } from '@/shared/ui-v2/label-container'
import { ReportYearSelect } from '@/features/report-year-select'
import { ReportRowsTable, type ReportRowsTableAlert } from '@/widgets/report-rows-table'
import { DividerBase } from '@/shared/ui-v2/divider-base'

const store = useReportStore()
// Конструктор работает с записями выбранного года: таблица, итог, лимит и очистка.
const { activeYearRows: rows, activeYear, activeYearLimitStatus, hasUnsortedActiveYearRows } = storeToRefs(store)

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
const tableTotals = computed(() => getTableTotals(rows.value))
const displayTotalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: localeStore.currentLocale }))

// Предупреждения о лимитах выбранного года: годовой лимит паушала и скользящий 12-месячный лимит PDV.
const limitAlerts = computed<ReportRowsTableAlert[]>(() => {
  const { isPausalLimitExceeded, pdvLimitExceedance } = activeYearLimitStatus.value
  const locale = localeStore.currentLocale
  const alerts: ReportRowsTableAlert[] = []

  if (isPausalLimitExceeded) {
    alerts.push({
      id: 'pausal-limit',
      message: t('ui.tableAlerts.pausalLimit.message'),
      // Оборот за год не повторяем — он уже есть в «Итого» под таблицей.
      details: t('ui.tableAlerts.pausalLimit.description'),
    })
  }

  if (pdvLimitExceedance) {
    alerts.push({
      id: 'pdv-limit',
      message: t('ui.tableAlerts.pdvLimit.message'),
      details: t('ui.tableAlerts.pdvLimit.description'),
      error: t('ui.tableAlerts.pdvLimit.details', {
        date: formatDateForUi(pdvLimitExceedance.date),
        amount: formatMoney(pdvLimitExceedance.totalRsdCents, { locale }),
      }),
    })
  }

  return alerts
})

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
  formMode.value === 'edit'
    ? t('ui.reportRowForm.titleEditYear', { year: activeYear.value })
    : t('ui.reportRowForm.titleAddYear', { year: activeYear.value }),
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

// Подсветка новой строки или строки, у которой сменилась дата (она могла переместиться в таблице).
const highlightedRowId = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

async function highlightRow(id: string) {
  clearTimeout(highlightTimer)
  // Сбрасываем и ставим заново, чтобы анимация перезапустилась, если подсвечиваем ту же строку повторно.
  highlightedRowId.value = null
  await nextTick()
  highlightedRowId.value = id
  highlightTimer = setTimeout(() => {
    highlightedRowId.value = null
  }, ROW_HIGHLIGHT_DURATION_MS)
}

onBeforeUnmount(() => clearTimeout(highlightTimer))

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
    const isDateChanged = store.getRowById(row.id)?.date !== row.date
    store.updateRowById(row.id, row)
    if (isDateChanged) highlightRow(row.id)
  } else {
    store.addRow(row)
    highlightRow(row.id)
  }

  closeModal()
}

// На планшете и мобилке свои виды таблицы, переключатель «Краткий / Расширенный» там не показываем.
const viewport = useViewport()

const sizeRow = computed<'short' | 'full'>({
  get: () => (isFullTable.value ? 'full' : 'short'),
  set: (value) => {
    isFullTable.value = value === 'full'
  },
})

const options = [
  {
    value: 'short',
    label: 'Краткий',
  },
  {
    value: 'full',
    label: 'Расширенный',
  },
]

const isShowYearSelect = computed(() => {
  const isMobaile = viewport.value === 'mobile'
  const isntEmpty = Boolean(rows.value.length)

  if (isMobaile) {
    return !isntEmpty
  } else {
    return true
  }
})
</script>

<template>
  <div class="ReportRowManage">
    <div class="ReportRowManage-Header">
      <h2 class="ReportRowManage-Title u-typo-h2-l">
        {{ t('ui.reportBuilderSections.incomeRecords') }}
      </h2>

      <ReportYearSelect size="middle" typography="button-l" placement="center" v-if="isShowYearSelect" />

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

      <div class="ReportRowManage_Actions" v-if="rows.length">
        <div class="ReportRowManage_Actions_left" v-if="viewport === 'desktop'">
          <ButtonWithIcon :icon="IconAddCircle" variant="page" @click="openCreateModal()">
            {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
          </ButtonWithIcon>
          <ButtonWithIcon :icon="IconTrash" variant="danger" @click="openDialogConfirm = true">
            {{ t('ui.reportBuilderIncomeRecordsTable.clearYear') }}
          </ButtonWithIcon>
        </div>

        <div class="ReportRowManage_Actions_left" v-else-if="viewport === 'tablet'">
          <ButtonWithIcon :icon="IconAddCircle" variant="page" @click="openCreateModal()">
            {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
          </ButtonWithIcon>
          <ButtonWithIcon :icon="IconTrash" variant="danger" @click="openDialogConfirm = true">
            {{ t('ui.reportBuilderIncomeRecordsTable.clearYear') }}
          </ButtonWithIcon>
        </div>

        <div class="ReportRowManage_Actions_mobile" v-else>
          <ButtonIcon ariaLabel="Добавить строку" size="l" type="button" variant="page" @click="openCreateModal()">
            <IconAddCircle size="m" />
          </ButtonIcon>
          <ReportYearSelect size="middle" typography="button-l" placement="center" />
          <ButtonIcon
            ariaLabel="Очистить год"
            size="l"
            type="button"
            variant="danger"
            @click="openDialogConfirm = true"
          >
            <IconTrash size="m" />
          </ButtonIcon>
        </div>

        <LabelContainer
          v-if="viewport === 'desktop'"
          ariaLabel="Вариант таблицы"
          v-model="sizeRow"
          :options="options"
          size="l"
        />
      </div>
    </div>

    <ReportRowsTable
      v-if="rows.length"
      :viewport="viewport"
      :size-row="sizeRow"
      :rows="rows"
      :locale="localeStore.currentLocale"
      :report-title="t('ui.reportBuilderSections.incomeRecords')"
      :display-total-rsd="displayTotalRsd"
      :limit-alerts="limitAlerts"
      :has-unsorted-rows="hasUnsortedActiveYearRows"
      :has-rows-from-different-years="false"
      :highlighted-row-id="highlightedRowId"
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
      <DividerBase class="ReportRowManage_Divider" />
      <div class="ReportRowManage-ModalActions">
        <ButtonBase variant="page" size="m" @click="closeModal" full-width>{{
          t('ui.reportRowForm.cancel')
        }}</ButtonBase>
        <ButtonBase variant="accent" size="m" :disabled="!canSubmit" type="submit" form="report-row-form" full-width>
          {{ t('ui.reportRowForm.submit') }}
        </ButtonBase>
      </div>
    </ModalBase>

    <DialogConfirm
      v-model:open="openDialogConfirm"
      :title="t('ui.deleteYearRowsModal.title', { year: activeYear })"
      :message="clearYearMessage"
      :details="t('ui.deleteYearRowsModal.description')"
      :labelPrimaryButton="t('ui.deleteYearRowsModal.confirm')"
      :labelSecondaryButton="t('ui.deleteYearRowsModal.cancel')"
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

.ReportRowManage_Actions {
  display: flex;
  width: 100%;
  padding-inline: 16px;
  justify-content: space-between;
  align-items: flex-end;
}

.ReportRowManage_Actions_left {
  padding-top: 40px;
  display: flex;
  gap: 24px;
}

.ReportRowManage_Actions_mobile {
  display: flex;
  padding-top: 8px;
  width: 100%;
  justify-content: space-between;
  gap: 16px;
}

.ReportRowManage_Divider {
  margin-block: 24px;
}
</style>
