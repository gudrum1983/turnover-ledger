<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseDividerToggle, BaseModal, IconAdd, IconCompress, IconExpand, ConfirmDialog } from '@/shared/ui'
import ReportTableRow from './ReportTableRow.vue'
import ReportRowCreateForm, {
  type ReportRowFormInitialValue,
  type ReportRowPayload,
} from '@/widgets/create-form/ui/ReportRowCreateForm.vue'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { storeToRefs } from 'pinia'
import type { ReportRow } from '@/shared/types/report.ts'
import { formatMoney, getTableTotals } from '@/shared/lib'
import { useLocaleStore } from '@/app/stores/localeStore.ts'
import { useLocale } from '@/shared/i18n'

const store = useMetaDataStore()
const { rows } = storeToRefs(store)

const localeStore = useLocaleStore()
const { t } = useLocale()

const isFullTable = ref<boolean>(true)

const sizeRow = computed(() => (isFullTable.value ? 'short' : 'full'))

const tableTotals = computed(() => getTableTotals(rows.value))
const displayTotalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: localeStore.currentLocale }))

type FormMode = 'create' | 'edit'

const open = ref(false)
const canSubmit = ref(false)
const formKey = ref(0)
const formMode = ref<FormMode>('create')
const editingRowId = ref<string | null>(null)
const formInitialValue = ref<ReportRowFormInitialValue | null>(null)

const openConfirmDialog = ref(false)

const modalTitle = computed(() =>
  formMode.value === 'edit' ? t('ui.reportTableRow.edit') : t('ui.reportTable.addRowModalTitle'),
)
const submitLabel = computed(() => (formMode.value === 'edit' ? t('ui.reportTableRow.edit') : t('ui.reportTable.add')))

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

function handleEdit(id: string) {
  openEditModal(id)
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

function closeConfirmDialog() {
  openConfirmDialog.value = false
}

function handleClearTable() {
  store.clearRows()
  closeConfirmDialog()
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

/*todo № на русском, br. ser, # на английском*/
</script>

<template>
  <div class="ReportTable">
    <BaseDividerToggle
      v-model="isFullTable"
      :label="`${t('report.title.firstLine')} ${t('report.title.secondLine')}`"
      color="disabled"
    >
      <template #icon-active><IconExpand style="width: 18px; height: 18px" /></template>
      <template #icon><IconCompress style="width: 18px; height: 18px" /></template>
    </BaseDividerToggle>

    <div class="ReportTable_Fieldset">
      <div class="ReportTable_Actions">
        <div class="ReportTable_RowActions">
          <BaseButton color="primary" size="xs" @click="openCreateModal()" class="">{{
            t('ui.reportTable.addRow')
          }}</BaseButton>
          <BaseButton color="danger" size="xs" v-if="rows.length > 0" @click="openConfirmDialog = true">{{
            t('ui.reportTable.clearTable')
          }}</BaseButton>
        </div>
      </div>
      <div>
        <div class="ReportTable_Header">
          <div>{{ t('ui.reportTable.rowNumber') }}</div>
          <div>{{ t('report.table.dateAndDescription') }}</div>
          <div></div>
          <div>{{ t('ui.reportTable.income') }}<br />{{ t('ui.reportTable.currency') }}</div>
          <div>{{ t('ui.reportTable.income') }}<br />RSD</div>
          <div></div>
        </div>
        <div class="ReportTable_Rows">
          <ReportTableRow
            v-for="(row, index) in rows"
            :size="sizeRow"
            :key="row.id"
            :index="index"
            :row="row"
            :locale="localeStore.currentLocale"
            @edit="handleEdit"
            @copy="handleCopy"
            @remove="handleRemove"
          />
        </div>
        <div v-if="rows.length < 1" class="ReportTable_Empty">
          {{ t('ui.reportTable.emptyHint') }}
          <BaseButton color="primary" size="xs" @click="openCreateModal()" variant="outline" isIconOnly>
            <template #icon>
              <IconAdd style="width: 18px; height: 18px" />
            </template>
          </BaseButton>
        </div>

        <div v-if="rows.length > 0" class="ReportTable_TotalRow">
          <div></div>
          <div></div>
          <div></div>
          <div class="ReportTable_TotalCell Typo_BodyAccent">{{ t('ui.reportTable.total') }}</div>
          <div class="ReportTable_TotalCell Typo_BodyAccent">{{ displayTotalRsd }}</div>
          <div></div>
        </div>
      </div>
    </div>
    <BaseModal :open="open" @close="closeModal" closeOnEsc>
      <h2>{{ modalTitle }}</h2>
      <ReportRowCreateForm
        :key="formKey"
        :initial-value="formInitialValue"
        @update:canSubmit="canSubmit = $event"
        @submit="onSubmit"
        id="testForm"
      />
      <template #actions>
        <BaseButton size="md" @click="closeModal">{{ t('ui.reportTable.cancel') }}</BaseButton>
        <BaseButton color="primary" size="md" :disabled="!canSubmit" type="submit" form="testForm">
          {{ submitLabel }}
        </BaseButton>
      </template>
    </BaseModal>

    <ConfirmDialog
      v-model:open="openConfirmDialog"
      @confirm="handleClearTable"
      :title="t('ui.deleteAllRowsModal.title')"
      :message="t('ui.deleteAllRowsModal.description')"
      :labelActiveButton="t('ui.deleteAllRowsModal.confirm')"
      :labelCancelButton="t('ui.deleteAllRowsModal.cancel')"
      type="delete"
    />
  </div>
</template>

<style scoped lang="scss">
.ReportTable {
  &_Fieldset {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 20px;
  }

  &_Actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
  }

  &_ReportControls {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
  }

  &_YearField {
    width: 100%;
    max-width: 230px;
  }

  &_RowActions {
    display: flex;
    gap: 10px;
    // margin-left: auto;
  }

  &_Header {
    display: grid;
    grid-template-columns: 50px auto 60px 90px 130px 150px;
    width: 100%;
    border: 1px solid var(--color-border-table-cell);
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    background: var(--color-background-default);

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
    }
  }

  &_Empty {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 10px;
    text-align: center;
    color: var(--color-text-disabled);
    border: 1px solid var(--color-border-table-cell);
    border-radius: 0 0 6px 6px;
    border-top: none;
  }

  &_Rows {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-table-cell);
  }

  &_TotalRow {
    display: grid;
    grid-template-columns: 50px auto 60px 90px 130px 140px;
    gap: 5px;
    width: 100%;
    border: 1px solid var(--color-border-table-cell);
    border-top: none;
    border-radius: 0 0 6px 6px;
    background: var(--color-background-default);
  }

  &_TotalCell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 5px;
    text-align: center;

    &_type_number {
      justify-content: flex-start;
    }

    &_type_label {
      justify-content: flex-start;
      font-weight: 600;
    }

    &_type_value {
      font-weight: 600;
    }
  }
}
</style>
