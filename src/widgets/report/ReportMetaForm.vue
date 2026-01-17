<script setup lang="ts"></script>

<template>
  <div class="ReportMetaForm">
    <label>PIB: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Obveznik: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Firma-radnja: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Sedište: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Šifra poreskog obveznika: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Šifra delatnosti: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Sastavio: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Odgovorno lice: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
  </div>
</template>

<style scoped>
.ReportMetaForm {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>
