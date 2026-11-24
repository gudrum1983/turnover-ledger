<script setup lang="ts">
// Шапка таблицы записей — общий вид для всех вариантов таблицы (десктоп, планшет, мобилка).
// Состав колонок задаёт вариант таблицы через слот: каждый прямой потомок — ячейка шапки.
const { columns } = defineProps<{
  /** Значение grid-template-columns. Должно совпадать с сеткой строк этого варианта таблицы */
  columns: string
}>()
</script>

<template>
  <div class="ReportRowsTableHeader u-typo-label-s" :style="{ gridTemplateColumns: columns }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ReportRowsTableHeader {
  display: grid;
  width: 100%;
  min-height: 56px;
  background: var(--neutral-200);
  border-bottom: 1px solid #a7afb1;
  // Переход ширины колонок задаёт таблица на время переключения вида (--report-table-columns-transition).
  transition: var(--report-table-columns-transition, grid-template-columns 0s);

  :slotted(*) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    text-align: center;
  }
}
</style>
