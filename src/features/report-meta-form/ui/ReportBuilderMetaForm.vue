<script setup lang="ts">
import { DividerToggle } from '@/shared/ui/divider-toggle'
import { FieldBase } from '@/shared/ui/field-base'
import { FieldDigit } from '@/shared/ui/field-digit'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { FOOTER_FIELDS, HEADER_FIELDS, type FooterField, type HeaderField, useReportStore } from '@/entities/report'
import { useLocale } from '@/shared/i18n'

const store = useReportStore()
const { formData } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store
const { t } = useLocale()

type HeaderMetaField = { key: HeaderField; label: string; isDigit: boolean }
type FooterMetaField = { key: FooterField; label: string; isDigit: boolean }

const DIGIT_FIELDS: HeaderField[] = ['pib', 'taxNumber']

const headerMetaFields = computed<HeaderMetaField[]>(() =>
  HEADER_FIELDS.map((key) => ({
    key,
    label: t(`report.header.${key}`),
    isDigit: DIGIT_FIELDS.includes(key),
  })),
)

const footerMetaFields = computed<FooterMetaField[]>(() =>
  FOOTER_FIELDS.map((key) => ({
    key,
    label: t(`report.footer.${key}`),
    isDigit: false,
  })),
)

const isOpenHeader = ref(true)
const isOpenFooter = ref(true)
</script>

<template>
  <div>
    <div class="ReportMetaForm">
      <DividerToggle
        v-model="isOpenHeader"
        :label="t('ui.reportMetaForm.taxpayerInfo')"
        :aria-expand-label="t('ui.accessibility.expandSection')"
        :aria-collapse-label="t('ui.accessibility.collapseSection')"
        color="disabled"
      />
      <div v-show="isOpenHeader" class="ReportMetaForm_Fieldset">
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
      <div v-show="isOpenFooter" class="ReportMetaForm_Fieldset">
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  row-gap: 6px;
  column-gap: 10px;
}
</style>
