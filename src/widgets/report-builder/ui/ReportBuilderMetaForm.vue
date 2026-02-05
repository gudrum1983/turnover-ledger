<script setup lang="ts">
import BaseField from '@/shared/ui/forms/BaseField.vue'
import DigitField from '@/shared/ui/forms/DigitField.vue'

import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { storeToRefs } from 'pinia'
import { HEADER_FIELDS, FOOTER_FIELDS } from '@/shared/constants/reportFields.ts'
import type { FooterField, HeaderField } from '@/shared/constants/reportFields.ts'

const store = useMetaDataStore()
const { formData } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store

type HeaderMetaField = { key: HeaderField; label: string; isDigit: boolean }
type FooterMetaField = { key: FooterField; label: string; isDigit: boolean }

const DIGIT_FIELDS: HeaderField[] = ['pib', 'taxNumber']

const headerMetaFields: HeaderMetaField[] = HEADER_FIELDS.map((key) => ({
  key,
  label: KPO_DICTIONARY.header[key].ru,
  isDigit: DIGIT_FIELDS.includes(key),
}))

const footerMetaFields: FooterMetaField[] = FOOTER_FIELDS.map((key) => ({
  key,
  label: KPO_DICTIONARY.footer[key].ru,
  isDigit: false,
}))
</script>

<template>
  <div>
    <div class="ReportMetaForm">
      <fieldset class="ReportMetaForm_Fieldset">
        <legend>Информация о налогоплательщике</legend>
        <component
          v-for="field in headerMetaFields"
          :key="field.key"
          :is="field.isDigit ? DigitField : BaseField"
          :name="field.key"
          :label="`${field.label}:`"
          :modelValue="formData.header[field.key]"
          @update:modelValue="setHeaderValue(field.key, $event ?? '')"
        />
      </fieldset>
      <fieldset class="ReportMetaForm_Fieldset">
        <legend>Ответственные лица</legend>
        <BaseField
          v-for="field in footerMetaFields"
          :key="field.key"
          :name="field.key"
          :label="`${field.label}:`"
          :modelValue="formData.footer[field.key]"
          @update:modelValue="setFooterValue(field.key, $event ?? '')"
        />
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.ReportMetaForm {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.ReportMetaForm_Fieldset {
  display: grid;
  border-radius: 10px;
  border: 1px solid var(--color-border-disabled);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  row-gap: 6px;
  column-gap: 10px;
  legend {
    color: var(--color-text-default);
    padding-inline: 10px;
  }
}
</style>
