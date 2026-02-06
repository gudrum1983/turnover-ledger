<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseDividerToggle, BaseModal, IconAdd, IconCompress, IconExpand } from '@/shared/ui'
import ReportTableRow from './ReportTableRow.vue'
import ReportRowCreateForm, { type ReportRowPayload } from './ReportRowCreateForm.vue'
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { storeToRefs } from 'pinia'
import type { ReportRow } from '@/shared/types/report.ts'
import { formatMoney, getTableTotals } from '@/shared/lib'

const store = useMetaDataStore()
const { rows } = storeToRefs(store)

const isFullTable = ref<boolean>(true)

const sizeRow = computed(() => (isFullTable.value ? 'short' : 'full'))

const tableTotals = computed(() => getTableTotals(rows.value))
const displayTotalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: 'sr' }))

function handleEdit(id: string) {
  void id
  alert('Редактирование строки')
}

function handleCopy(id: string) {
  const row = store.getRowById(id)
  if (!row) return
  store.addRow({ ...row, id: createRowId() })
}

function handleRemove(id: string) {
  store.removeRowById(id)
}
const open = ref(false)
const canSubmit = ref(false)
const formKey = ref(0)

function closeModal() {
  open.value = false
  canSubmit.value = false
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
  if (payload.calculatedGoodsConverted === null || payload.calculatedServicesConverted === null) return

  const row: ReportRow = {
    id: createRowId(),
    date: payload.date,
    description: payload.description,
    currency: payload.currency.toUpperCase(),
    amounts: {
      goods: {
        foreignCents: toCents(payload.goodsAmount),
        rsdCents: toCents(payload.calculatedGoodsConverted),
      },
      services: {
        foreignCents: toCents(payload.servicesAmount),
        rsdCents: toCents(payload.calculatedServicesConverted),
      },
    },
  }

  store.addRow(row)
  closeModal()
  formKey.value += 1
}

/*todo № на русском, br. ser, # на английском*/
</script>

<template>
  <div class="ReportTable">
    <BaseDividerToggle
      v-model="isFullTable"
      :label="`${KPO_DICTIONARY.title.firstLine.ru} ${KPO_DICTIONARY.title.secondLine.ru}`"
      color="disabled"
    >
      <template #icon-active><IconExpand style="width: 18px; height: 18px" /></template>
      <template #icon><IconCompress style="width: 18px; height: 18px" /></template>
    </BaseDividerToggle>

    <div class="ReportTable_Fieldset">
      <div class="ReportTable_Actions">
        <BaseButton color="primary" size="xs" @click="open = true" class="">Добавить строку</BaseButton>
        <BaseButton color="danger" size="xs" v-if="rows.length > 0">Очистить таблицу</BaseButton>
      </div>
      <div>
        <div class="ReportTable_Header">
          <div>№</div>
          <div>{{ KPO_DICTIONARY.table.dateAndDescription.ru }}</div>
          <div></div>
          <div>Доход<br />Валюта</div>
          <div>Доход<br />RSD</div>
          <div></div>
        </div>
        <div class="ReportTable_Rows">
          <ReportTableRow
            v-for="(row, index) in rows"
            :size="sizeRow"
            :key="row.id"
            :index="index"
            :row="row"
            @edit="handleEdit"
            @copy="handleCopy"
            @remove="handleRemove"
          />
        </div>
        <div v-if="rows.length < 1" class="ReportTable_Empty">
          Таблица пустая, добавьте строку ...
          <BaseButton color="primary" size="xs" @click="open = true" variant="outline" isIconOnly>
            <template #icon>
              <IconAdd style="width: 18px; height: 18px" />
            </template>
          </BaseButton>
        </div>

        <div v-if="rows.length > 0" class="ReportTable_TotalRow">
          <div></div>
          <div></div>
          <div></div>
          <div class="ReportTable_TotalCell Typo_BodyAccent">Итого</div>
          <div class="ReportTable_TotalCell Typo_BodyAccent">{{ displayTotalRsd }}</div>
          <div></div>
        </div>
      </div>
    </div>
    <BaseModal :open="open" @close="closeModal">
      <h2>Добавить строку</h2>
      <ReportRowCreateForm :key="formKey" @update:canSubmit="canSubmit = $event" @submit="onSubmit" id="testForm" />
      <template #actions>
        <BaseButton size="xs" @click="closeModal">Отмена</BaseButton>
        <BaseButton color="primary" size="xs" :disabled="!canSubmit" type="submit" form="testForm">Добавить</BaseButton>
      </template>
    </BaseModal>
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
    display: grid;
    grid-template-columns: repeat(2, 160px);
    grid-auto-columns: 160px;
    grid-auto-flow: column;
    justify-content: space-between;
    width: 100%;
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
