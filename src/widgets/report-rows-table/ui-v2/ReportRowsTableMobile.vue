<script setup lang="ts">
import { ReportTableRow, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
import ReportRowsTableHeader from './ReportRowsTableHeader.vue'

// Заготовка таблицы для мобильного экрана (< 768 px).
// TODO: заменить на собственную вёрстку по макету (например, карточки вместо строк). Пока переиспользуем
// десктопную строку в кратком виде внутри горизонтального скролла, чтобы все действия (в т. ч. удаление
// с подтверждением) работали. Компонент карточки строки, если понадобится, — в entities/report-row/ui-v2.
const { rows, locale } = defineProps<{
  rows: ReportRow[]
  locale: I18nLocale
}>()

const emit = defineEmits<{
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const { t } = useLocale()

const COLUMNS = '60px 120px auto clamp(90px, 10vw, 180px) clamp(90px, 10vw, 180px) clamp(90px, 10vw, 180px) 48px'
</script>

<template>
  <div class="ReportRowsTableMobile">
    <ReportRowsTableHeader :columns="COLUMNS">
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.rowNumber') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.date') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.description') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.currency') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }} в RSD</div>
      <div></div>
    </ReportRowsTableHeader>
    <div class="ReportRowsTableMobile-Rows">
      <ReportTableRow
        v-for="(row, index) in rows"
        :key="row.id"
        :index="index"
        :locale="locale"
        :row="row"
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
.ReportRowsTableMobile {
  display: grid;

  &-Rows {
    display: flex;
    flex-direction: column;
  }
}
</style>
