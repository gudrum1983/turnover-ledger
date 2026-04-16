<script setup lang="ts">
import { DividerToggle } from '@/shared/ui/divider-toggle'
import { FieldBase } from '@/shared/ui/field-base'
import { FieldDigit } from '@/shared/ui/field-digit'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  FOOTER_FIELDS,
  HEADER_FIELDS,
  getReportFooterLabel,
  getReportHeaderLabel,
  type FooterField,
  type HeaderField,
  useReportScript,
  useReportStore,
} from '@/entities/report'
import { useLocale } from '@/shared/i18n'

const store = useReportStore()
const { formData } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store
const { t } = useLocale()
const { script } = useReportScript()

type HeaderMetaField = { key: HeaderField; label: string; isDigit: boolean }
type FooterMetaField = { key: FooterField; label: string; isDigit: boolean }

const DIGIT_FIELDS: HeaderField[] = ['pib', 'taxNumber']

const headerMetaFields = computed<HeaderMetaField[]>(() =>
  HEADER_FIELDS.map((key) => ({
    key,
    label: getReportHeaderLabel(key, script.value),
    isDigit: DIGIT_FIELDS.includes(key),
  })),
)

const footerMetaFields = computed<FooterMetaField[]>(() =>
  FOOTER_FIELDS.map((key) => ({
    key,
    label: getReportFooterLabel(key, script.value),
    isDigit: false,
  })),
)

const isOpenHeader = ref(true)
const isOpenFooter = ref(true)
</script>

<template>
  <div class="ReportMetaEditForm">
    <DividerToggle
      v-model="isOpenHeader"
      :label="t('ui.reportMetaForm.taxpayerInfo')"
      :aria-expand-label="t('ui.accessibility.expandSection')"
      :aria-collapse-label="t('ui.accessibility.collapseSection')"
      color="disabled"
    />
    <div v-show="isOpenHeader" class="ReportMetaEditForm_Fieldset">
      <component
        v-for="field in headerMetaFields"
        :key="field.key"
        :is="field.isDigit ? FieldDigit : FieldBase"
        :name="field.key"
        :label="`${field.label}:`"
        :modelValue="formData.header[field.key]"
        @update:modelValue="setHeaderValue(field.key, $event ?? '')"
      />
    </div>

    <DividerToggle
      v-model="isOpenFooter"
      :label="t('ui.reportMetaForm.responsiblePeople')"
      :aria-expand-label="t('ui.accessibility.expandSection')"
      :aria-collapse-label="t('ui.accessibility.collapseSection')"
      color="disabled"
    />
    <div v-show="isOpenFooter" class="ReportMetaEditForm_Fieldset">
      <FieldBase
        v-for="field in footerMetaFields"
        :key="field.key"
        :name="field.key"
        :label="`${field.label}:`"
        :modelValue="formData.footer[field.key]"
        @update:modelValue="setFooterValue(field.key, $event ?? '')"
      />
    </div>
  </div>
</template>

<style scoped>
.ReportMetaEditForm {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.ReportMetaEditForm_Fieldset {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  row-gap: 6px;
  column-gap: 10px;
}
</style>
