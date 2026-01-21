<script setup lang="ts">
import BaseField from '@/shared/ui/BaseField.vue'
import MoneyField from '@/shared/ui/MoneyField.vue'
import DigitField from '@/shared/ui/DigitField.vue'

import { ref, watch } from 'vue'
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'

const formData = ref({
  header: {
    pib: '',
    taxpayer: '',
    companyName: '',
    address: '',
    taxNumber: '',
    activityCode: '',
  },
  footer: {
    preparedBy: '',
    responsiblePerson: '',
  },
})

const fieldAmountAlt = ref<string | null>('')
const fieldDigits = ref<string | null>('')
const companySuggestions = ['Alpha', 'Beta', 'Gamma']

watch(
  formData,
  (value) => {
    console.log('formData changed:', value)
  },
  { deep: true },
)

function withColon(label: string) {
  return `${label}:`
}
</script>

<template>
  <!-- todo - убрать лишнюю обертку и убрать тестовый компонент    -->
  <div>
    <div class="ReportMetaForm">
      <BaseField
        v-for="(field, key) in KPO_DICTIONARY.header"
        :key="key"
        :name="key"
        :label="withColon(field.ru)"
        v-model="formData.header[key]"
      />

      <BaseField
        v-for="(field, key) in KPO_DICTIONARY.footer"
        :key="key"
        :name="key"
        :label="withColon(field.ru)"
        v-model="formData.footer[key]"
      />
    </div>
    <div style="background: bisque; padding: 5px; max-width: 200px; margin: 10px" class="TestComponent">
      <BaseField
        name="company"
        label="Компания:"
        v-model="formData.header.companyName"
        :datalist="companySuggestions"
      />
      <MoneyField name="amountAlt" label="Сумма (через BaseField):" v-model="fieldAmountAlt" placeholder="0,00" />
      <DigitField name="digitsOnly" label="Только цифры:" v-model="fieldDigits" placeholder="12345" />
    </div>
  </div>
</template>

<style scoped>
.ReportMetaForm {
  display: grid;
  grid-auto-flow: column;
  grid-auto-rows: auto;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  row-gap: 6px;
  column-gap: 10px;
}
</style>
