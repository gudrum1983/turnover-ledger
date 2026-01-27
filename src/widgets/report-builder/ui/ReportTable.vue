<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import ReportTableRow from './ReportTableRow.vue'
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import { MOCK } from '@/shared/mock.ts'
import type { ReportRow } from '@/shared/types/report.ts'

const rows = ref<ReportRow[]>(MOCK)

const sizeRow = ref<'short' | 'full'>('full')

const textSizeRow = computed(() => (sizeRow.value === 'full' ? 'Сжать таблицу' : 'Раскрыть таблицу'))

function handleEdit(index: number) {
  void index
  alert('Редактирование строки')
}

function handleCopy(index: number) {
  void index
  alert('Копирование строки')
}

function handleRemove(index: number) {
  void index
  alert('Удаление строки')
}

/*todo № на русском, br. ser, # на английском*/
</script>

<template>
  <div class="ReportTable">
    <fieldset class="ReportTable_Fieldset">
      <legend>{{ KPO_DICTIONARY.title.firstLine.ru }}{{ KPO_DICTIONARY.title.secondLine.ru }}</legend>
      <div class="ReportTable_Actions">
        <BaseButton color="primary" size="xs">Добавить строку</BaseButton>
        <BaseButton color="danger" size="xs">Очистить таблицу</BaseButton>

        <BaseButton color="warning" size="xs" @click="sizeRow = sizeRow === 'full' ? 'short' : 'full'">{{
          textSizeRow
        }}</BaseButton>
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
            :key="index"
            :index="index"
            :row="row"
            @edit="handleEdit"
            @copy="handleCopy"
            @remove="handleRemove"
          />
        </div>
      </div>
    </fieldset>
  </div>
</template>

<style scoped lang="scss">
.ReportTable {
  &_Fieldset {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid var(--color-border-disabled);
    border-radius: 10px;

    legend {
      color: var(--color-text-default);
      padding-inline: 10px;
    }
  }

  &_Actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &_Header {
    display: grid;
    grid-template-columns: 50px auto 60px 90px 130px 140px;
    gap: 5px;
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

  &_Rows {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-table-cell);
  }
}
</style>
