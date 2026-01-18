<script setup lang="ts">
import BaseField from '@/shared/ui/BaseField.vue'

import { ref, watch } from 'vue'

//todo - проверка работы инпутов удалить после создания стора
// state
const fieldPib = ref<string | null>(null)

const fieldName = ref<string | null>(null)

const fieldNum = ref<number | null>(null)

// actions
// просто для проверки в консоле
watch(fieldPib, (v) => {
  console.log('fieldPib changed:', v)
})

watch(fieldName, (v) => {
  console.log('fieldPib changed:', v)
})

watch(fieldNum, (v) => {
  console.log('numberValue changed:', v)
})
</script>

<template>
  <div class="ReportMetaForm">
    <BaseField name="pib" label="PIB:" placeholder="lksdvlksnd" v-model="fieldPib" />
    <BaseField name="name" label="Firma-radnja:" v-model="fieldName" />
    <BaseField name="num" type="number" label="Num:" placeholder="0" v-model="fieldNum" />
    <label>PIB: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Obveznik: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Firma-radnja: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Sedište: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Šifra poreskog obveznika: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Šifra delatnosti: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Sastavio: <input type="text" required minlength="4" maxlength="8" size="10" /></label>
    <label>Odgovorno lice: <input type="text" required minlength="4" maxlength="8" size="10" /></label>

    <div>fieldPib: {{ fieldPib }}</div>
    <div>fieldName: {{ fieldName }}</div>
    <div>fieldNum: {{ fieldNum }}</div>
  </div>
</template>

<style scoped>
.ReportMetaForm {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 400px;
}
</style>
