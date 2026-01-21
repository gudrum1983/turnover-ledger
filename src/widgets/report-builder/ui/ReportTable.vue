<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'
</script>

<template>
  <div class="ReportTable">
    <div class="ReportTable__actions">
      <BaseButton color="primary" size="xs">Добавить строку</BaseButton>
      <BaseButton color="danger" size="xs">Очистить таблицу</BaseButton>
    </div>
    <h3>KNJIGA O OSTVARENOM PROMETU PAUŠALNO OPOREZOVANIH OBVEZNIKA</h3>
    <div class="ReportTable__header">
      <div class="ReportTable__col1">Redni broj</div>
      <div class="ReportTable__col2">Datum i opis knjiženja</div>
      <div class="ReportTable__headerCol">PRIHOD OD DELATNOSTI</div>
      <div class="ReportTable__col3">od prodaje proizvoda</div>
      <div class="ReportTable__col4">od izvršenih usluga</div>
      <div class="ReportTable__col5">SVEGA PRIHODI OD DELATNOSTI</div>
      <div class="ReportTable__num1">1</div>
      <div class="ReportTable__num2">2</div>
      <div class="ReportTable__num3">3</div>
      <div class="ReportTable__num4">4</div>
      <div class="ReportTable__num5">5</div>
    </div>
  </div>
</template>

<style scoped>
.ReportTable__header {
  width: 100%;
  max-width: 800px;
  display: grid;
  gap: 5px;
  grid-template-columns: 10% 20% 22% 22% 26%;
  grid-template-areas:
    'col1 col2 headerCol headerCol col5'
    'col1 col2 col3 col4 col5'
    'num1 num2 num3 num4 num5';
  div {
    display: flex;
    padding: 5px;
    background: beige;
    border: 2px solid grey;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

.ReportTable__actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.ReportTable__col1 {
  grid-area: col1;
}
.ReportTable__col2 {
  grid-area: col2;
}

.ReportTable__headerCol {
  grid-area: headerCol;
}

.ReportTable__col3 {
  grid-area: col3;
}

.ReportTable__col4 {
  grid-area: col4;
}

.ReportTable__col5 {
  grid-area: col5;
}

.ReportTable__num1 {
  grid-area: num1;
}
.ReportTable__num2 {
  grid-area: num2;
}
.ReportTable__num3 {
  grid-area: num3;
}
.ReportTable__num4 {
  grid-area: num4;
}
.ReportTable__num5 {
  grid-area: num5;
}
</style>
