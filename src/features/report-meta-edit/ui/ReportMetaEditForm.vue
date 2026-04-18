<script setup lang="ts">
import { DividerToggle } from '@/shared/ui/divider-toggle'
import { FieldBase } from '@/shared/ui/field-base'
import { FieldDigit } from '@/shared/ui/field-digit'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { FOOTER_META_FIELDS, HEADER_META_FIELDS, useReportStore } from '@/entities/report'
import { useLocale } from '@/shared/i18n'

const store = useReportStore()
const { formData } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store
const { t } = useLocale()

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
        v-for="field in HEADER_META_FIELDS"
        :key="field.key"
        :is="field.isDigit ? FieldDigit : FieldBase"
        :name="field.key"
        :label="`${t(field.labelKey)}:`"
        :placeholder="t(field.placeholderKey)"
        :hint="t(field.hintKey) || undefined"
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
      <component
        v-for="field in FOOTER_META_FIELDS"
        :key="field.key"
        :is="field.isDigit ? FieldDigit : FieldBase"
        :name="field.key"
        :label="`${t(field.labelKey)}:`"
        :placeholder="t(field.placeholderKey)"
        :hint="t(field.hintKey) || undefined"
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
