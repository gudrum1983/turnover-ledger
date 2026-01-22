<script setup lang="ts">
import BaseField from '@/shared/ui/BaseField.vue'
import MoneyField from '@/shared/ui/MoneyField.vue'
import DigitField from '@/shared/ui/DigitField.vue'

import { ref, watch } from 'vue'
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { storeToRefs } from 'pinia'
import { HEADER_FIELDS, FOOTER_FIELDS } from '@/shared/constants/reportFields.ts'

const store = useMetaDataStore()
const { formData, taxpayerUppercase } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store

/*const formData = ref({
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
})*/

const fieldAmountAlt = ref<string | null>('')
const fieldDigits = ref<string | null>('')
const fieldCompany = ref<string | null>('')

const companySuggestions = ['Alpha', 'Beta', 'Gamma']

/*watch(
  formData,
  (value) => {
    console.log('formData changed:', value)
  },
  { deep: true },
)*/

watch(taxpayerUppercase, (v) => {
  console.log(`taxpayerUppercase is ${v}`)
})

watch(fieldAmountAlt, (v) => {
  console.log(`fieldAmountAlt is ${v}`)
})
watch(fieldDigits, (v) => {
  console.log(`fieldDigits is ${v}`)
})
watch(fieldCompany, (v) => {
  console.log(`fieldCompany is ${v}`)
})

watch(
  store,
  (state) => {
    // сохранять все состояние в local storage при каждом его изменении
    localStorage.setItem('piniaState', JSON.stringify(state.formData))
    console.log(state.formData)
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
        v-for="key in HEADER_FIELDS"
        :key="key"
        :name="key"
        :label="withColon(KPO_DICTIONARY.header[key].ru)"
        :modelValue="formData.header[key]"
        @update:modelValue="setHeaderValue(key, $event ?? '')"
      />

      <BaseField
        v-for="key in FOOTER_FIELDS"
        :key="key"
        :name="key"
        :label="withColon(KPO_DICTIONARY.footer[key].ru)"
        :modelValue="formData.footer[key]"
        @update:modelValue="setFooterValue(key, $event ?? '')"
      />
    </div>
    <div style="background: bisque; padding: 5px; max-width: 200px; margin: 10px" class="TestComponent">
      <BaseField name="company" label="Компания:" v-model="fieldCompany" :datalist="companySuggestions" />
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
