<script setup lang="ts">
import { ReportTableRow, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
import ReportRowsTableHeader from './ReportRowsTableHeader.vue'

// Заготовка таблицы для планшета (768–1023 px).
// TODO: заменить на собственную вёрстку по макету. Пока переиспользуем десктопную строку
// в кратком виде внутри горизонтального скролла, чтобы все действия (в т. ч. удаление с подтверждением) работали.
// Если для строки понадобится свой компонент, его место — entities/report-row/ui-v2.
const {
  rows,
  locale,
  highlightedRowId = null,
} = defineProps<{
  rows: ReportRow[]
  locale: I18nLocale
  /** id строки, которую нужно подсветить (новая или переместившаяся после смены даты) */
  highlightedRowId?: string | null
}>()

const emit = defineEmits<{
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const { t } = useLocale()

// TODO: при необходимости поменять состав колонок — пока он как у десктопной строки, которую переиспользуем.
// Валюта и две колонки сумм тянутся вместе с экраном: 10% ширины окна, но не меньше минимума и не больше 180px.
// Минимум для сумм 124px вмещает любую сумму до годового лимита («5 999 999,99» + отступы ячейки ≈ 123px).
const COLUMNS =
  '60px clamp(90px, 10vw, 120px) auto clamp(90px, 10vw, 180px) clamp(90px, 10vw, 180px) clamp(90px, 10vw, 180px) 48px'
</script>

<template>
  <div class="ReportRowsTableTablet">
    <ReportRowsTableHeader :columns="COLUMNS">
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.rowNumber') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.date') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.description') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.currency') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }} в RSD</div>
      <div></div>
    </ReportRowsTableHeader>
    <div class="ReportRowsTableTablet-Rows">
      <ReportTableRow
        v-for="(row, index) in rows"
        :key="row.id"
        :index="index"
        :locale="locale"
        :row="row"
        :highlighted="row.id === highlightedRowId"
        :columns="COLUMNS"
        actions="menu"
        size="short"
        @edit="emit('edit', $event)"
        @copy="emit('copy', $event)"
        @remove="emit('remove', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportRowsTableTablet {
  display: grid;

  &-Rows {
    display: flex;
    flex-direction: column;
  }
}
</style>
