<script setup lang="ts">
import { ReportTableCard, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { DividerBase } from '@/shared/ui-v2/divider-base'

// Таблица для мобильного экрана (< 768 px): каждая строка отчёта — карточка ReportTableCard,
// действия (редактирование, копирование, удаление с подтверждением) — в её меню.
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
</script>

<template>
  <div class="ReportRowsTableMobile">
    <DividerBase />
    <div class="ReportRowsTableMobile-Rows">
      <ReportTableCard
        v-for="(row, index) in rows"
        :key="row.id"
        :index="index"
        :locale="locale"
        :row="row"
        :highlighted="row.id === highlightedRowId"
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
