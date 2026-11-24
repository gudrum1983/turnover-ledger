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
  // Липкая: названия колонок остаются у верха окна (под липкими кнопками страницы — их высота
  // в --report-table-sticky-top), пока прокручиваются строки. Шапка лежит в обёртке таблицы вместе
  // со строками, поэтому уходит вверх вместе с последней строкой, не наезжая на итог.
  position: sticky;
  top: var(--report-table-sticky-top, 0px);
  // Выше содержимого строк; меню действий (ActionMenu, z-index: 1000) остаётся поверх шапки.
  z-index: 2;
  display: grid;
  width: 100%;
  min-height: 56px;
  background: var(--neutral-200);
  border-bottom: 1px solid #a7afb1;

  // Затухание под прилипшей шапкой (ScrollFade из макета): продолжает фон шапки и сходит
  // в полупрозрачный белый — строки мягко уходят под шапку.
  // Видно, только когда шапка прилипла: страница задаёт --report-table-header-fade-opacity.
  &::after {
    content: '';
    position: absolute;
    // top: 100% — это низ области внутри рамки: затухание легло бы на нижнюю границу шапки.
    // Сдвигаем на её толщину, чтобы шапка выглядела как без затухания, а затухание шло под ней.
    top: calc(100% + 1px);
    left: 0;
    right: 0;
    height: 18px;
    background: linear-gradient(to bottom, var(--neutral-200), rgb(255 255 255 / 30%));
    opacity: var(--report-table-header-fade-opacity, 0);
    pointer-events: none;
    transition: opacity var(--transition-color);
  }
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
