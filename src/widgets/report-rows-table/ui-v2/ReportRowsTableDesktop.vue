<script setup lang="ts">
import { ReportTableRow, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
import ReportRowsTableHeader from './ReportRowsTableHeader.vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

// Десктопная таблица (≥ 1024 px): шапка-грид и строки в кратком или расширенном виде.
const {
  rows,
  locale,
  size,
  highlightedRowId = null,
} = defineProps<{
  rows: ReportRow[]
  locale: I18nLocale
  size: 'short' | 'full'
  /** id строки, которую нужно подсветить (новая или переместившаяся после смены даты) */
  highlightedRowId?: string | null
}>()

const emit = defineEmits<{
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const { t } = useLocale()

// Сетка колонок — общая для шапки и строк таблицы.
// Колонки сумм: в кратком виде тянутся с экраном (10% ширины окна, от 124 до 180px);
// 124px вмещают любую сумму до годового лимита («5 999 999,99» + отступы ячейки ≈ 123px).
// В расширенном виде рядом с суммами есть подписи (Тов./Усл./Сум.), поэтому ширина фиксированная — 180px.
const INCOME_COLUMN = {
  short: 'clamp(124px, 10vw, 180px)',
  full: '180px',
} as const

const COLUMNS = computed(() =>
  [
    '60px', // №
    'clamp(90px, 10vw, 120px)', // дата
    'auto', // описание
    'clamp(90px, 10vw, 180px)', // валюта
    INCOME_COLUMN[size], // сумма
    INCOME_COLUMN[size], // сумма в RSD
    '144px', // действия
  ].join(' '),
)

// Ширина колонок плавно меняется вместе с высотой строк при переключении краткий/полный вид.
// Переход включаем только на время переключения: колонки зависят от ширины окна (vw), и с постоянным
// переходом таблица догоняла бы окно с задержкой при изменении его размера.
// Длительность совпадает с анимацией высоты строк (income-details в ReportTableRow).
const COLUMNS_TRANSITION_MS = 200
const isResizingColumns = ref(false)
let resizeTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => size,
  () => {
    isResizingColumns.value = true
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      isResizingColumns.value = false
    }, COLUMNS_TRANSITION_MS)
  },
)

onBeforeUnmount(() => clearTimeout(resizeTimer))

/*const COLUMNS =
  '60px clamp(90px, 10vw, 120px) auto clamp(90px, 10vw, 180px) clamp(124px, 10vw, 180px) clamp(124px, 10vw, 180px) 144px'*/
</script>

<template>
  <div
    class="ReportRowsTableDesktop"
    :class="{ ReportRowsTableDesktop_resizingColumns: isResizingColumns }"
    :style="{ '--report-table-columns-duration': `${COLUMNS_TRANSITION_MS}ms` }"
  >
    <ReportRowsTableHeader :columns="COLUMNS">
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.rowNumber') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.date') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.description') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.currency') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }}</div>
      <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }} в RSD</div>
      <div></div>
    </ReportRowsTableHeader>
    <div class="ReportRowsTableDesktop-Rows">
      <ReportTableRow
        v-for="(row, index) in rows"
        :key="row.id"
        :index="index"
        :locale="locale"
        :row="row"
        :highlighted="row.id === highlightedRowId"
        :columns="COLUMNS"
        :size="size"
        @edit="emit('edit', $event)"
        @copy="emit('copy', $event)"
        @remove="emit('remove', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportRowsTableDesktop {
  // Шапка и строки берут переход колонок из этой переменной (наследуется вниз по дереву).
  &_resizingColumns {
    --report-table-columns-transition: grid-template-columns var(--report-table-columns-duration) ease;
  }

  @media (prefers-reduced-motion: reduce) {
    // Не none: в строке переход колонок стоит в списке вместе с фоном, а none в списке недопустим.
    &_resizingColumns {
      --report-table-columns-transition: grid-template-columns 0s;
    }
  }

  &-Rows {
    display: flex;
    flex-direction: column;
  }
}
</style>
