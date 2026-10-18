<script setup lang="ts">
import { FieldBase } from '@/shared/ui-v2/field-base'
import { FieldDigit } from '@/shared/ui-v2/field-digit'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  FOOTER_META_FIELDS,
  HEADER_META_FIELDS,
  getHeaderFieldError,
  getPersonNameError,
  useReportStore,
} from '@/entities/report'
import type { HeaderField, FooterField } from '@/entities/report'
import { useLocale } from '@/shared/i18n'
import { IconInfoCircle } from '@/shared/ui-v2/icons'
import { LinkBase } from '@/shared/ui-v2/link-base'
import { ROUTES } from '@/shared/constants/routes.ts'
import CollapseToggle from './CollapseToggle.vue'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import SignatoriesHint from './SignatoriesHint.vue'
import { FadeTransition } from '@/shared/ui-v2/fade-transition'

const store = useReportStore()
const { formData, metaFieldsProgress } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store
const { t } = useLocale()

const isOpenHeader = ref(true)
const touchedFields = ref<Partial<Record<HeaderField, boolean>>>({
  pib: Boolean(formData.value.header.pib),
  taxNumber: Boolean(formData.value.header.taxNumber),
  activityCode: Boolean(formData.value.header.activityCode),
  taxpayer: Boolean(formData.value.header.taxpayer),
})
const touchedFooterFields = ref<Partial<Record<FooterField, boolean>>>({
  preparedBy: Boolean(formData.value.footer.preparedBy),
  responsiblePerson: Boolean(formData.value.footer.responsiblePerson),
})

function footerFieldError(field: FooterField) {
  const value = formData.value.footer[field]
  if (!touchedFooterFields.value[field] || !value.trim()) return undefined
  const key = getPersonNameError(value)
  return key ? t(key) : undefined
}

function fieldError(field: HeaderField) {
  const value = formData.value.header[field]
  if (!touchedFields.value[field] || !value.trim()) return undefined
  const key = getHeaderFieldError(field, value)
  return key ? t(key) : undefined
}

function fieldErrorMessage(field: HeaderField) {
  const key = getHeaderFieldError(field, '')
  return key ? t(key) : undefined
}

const signatoriesMatchTaxpayer = computed(() => {
  const name = formData.value.header.taxpayer.trim()
  return formData.value.footer.preparedBy === name && formData.value.footer.responsiblePerson === name
})
const signatoriesHint = computed(() =>
  /*    t(
      signatoriesMatchTaxpayer.value
        ? 'ui.reportBuilderMetaFields.responsiblePeople.taxpayerHint'
        : 'ui.reportBuilderMetaFields.responsiblePeople.separateHint',
    ),*/
  t('ui.reportBuilderMetaFields.responsiblePeople.taxpayerHint'),
)

const isSignatoriesHintVisible = computed(() => {
  /*  const { preparedBy, responsiblePerson } = formData.value.footer

  return Boolean(preparedBy.trim() || responsiblePerson.trim())*/

  const name = formData.value.header.taxpayer.trim()
  return formData.value.footer.preparedBy === name && formData.value.footer.responsiblePerson === name && name !== ''
})

function copyTaxpayerToSignatories() {
  const name = formData.value.header.taxpayer.trim()
  setFooterValue('preparedBy', name)
  setFooterValue('responsiblePerson', name)
  touchedFooterFields.value.preparedBy = true
  touchedFooterFields.value.responsiblePerson = true
}
</script>

<template>
  <div class="ReportMetaEditForm">
    <div class="ReportMetaEditForm-Header">
      <h3 class="ReportMetaEditForm-Tittle u-typo-h1-l">Реквизиты документа</h3>
      <div class="ReportMetaEditForm-Info u-typo-label-s">
        <IconInfoCircle size="s" />
        <span>
          Все данные обрабатываются локально в вашем браузере
          <LinkBase :to="{ name: ROUTES.about.name }">подробнее</LinkBase>
        </span>
      </div>
      <CollapseToggle class="ReportMetaEditForm-CollapseToggle" v-model="isOpenHeader" />
      <span
        class="ReportMetaEditForm-Counter u-typo-body-small-m"
        :class="{ 'ReportMetaEditForm-Counter_complete': metaFieldsProgress.filled === metaFieldsProgress.total }"
      >
        <span class="ReportMetaEditForm-CounterLabel">заполнено полей: </span>
        {{ metaFieldsProgress.filled }} из {{ metaFieldsProgress.total }}
      </span>
    </div>

    <Transition name="report-meta-collapse">
      <div v-show="isOpenHeader" class="ReportMetaEditForm-Collapse">
        <div class="ReportMetaEditForm-Content">
          <h3 class="u-typo-subtitle-l" style="padding: 24px 0 16px">
            {{ t('ui.reportBuilderSections.taxpayerInfo') }}
          </h3>
          <div class="ReportMetaEditForm_Fieldset">
            <component
              v-for="field in HEADER_META_FIELDS"
              :key="field.key"
              :is="field.isDigit ? FieldDigit : FieldBase"
              variant="card"
              :name="field.key"
              :label="t(field.labelKey)"
              :placeholder="t(field.placeholderKey)"
              :hint="t(field.hintKey) || undefined"
              :modelValue="formData.header[field.key]"
              :max-length="field.key === 'pib' || field.key === 'taxNumber' ? 13 : undefined"
              :error="Boolean(fieldError(field.key))"
              :error-message="fieldErrorMessage(field.key)"
              :debounce-ms="field.key === 'taxpayer' ? 0 : undefined"
              @update:modelValue="setHeaderValue(field.key, $event ?? '')"
              @blur="touchedFields[field.key] = true"
            />
          </div>
          <div class="ReportMetaEditForm-SignatoriesHeader">
            <h3 class="u-typo-subtitle-l">
              {{ t('ui.reportBuilderSections.responsiblePeople') }}
            </h3>
            <div class="ReportMetaEditForm-SignatoriesHintContainer" aria-live="polite">
              <FadeTransition mode="out-in">
                <SignatoriesHint
                  v-if="isSignatoriesHintVisible"
                  :key="signatoriesHint"
                  :automatic="signatoriesMatchTaxpayer"
                  :text="signatoriesHint"
                />
              </FadeTransition>
            </div>
          </div>
          <div class="ReportMetaEditForm_Fieldset ReportMetaEditForm_Fieldset_footer">
            <component
              v-for="field in FOOTER_META_FIELDS"
              :key="field.key"
              :is="field.isDigit ? FieldDigit : FieldBase"
              variant="card"
              :name="field.key"
              :label="t(field.labelKey)"
              :placeholder="t(field.placeholderKey)"
              :hint="t(field.hintKey) || undefined"
              :modelValue="formData.footer[field.key]"
              :error="Boolean(footerFieldError(field.key))"
              :error-message="t('ui.reportBuilderMetaFields.validation.personName')"
              @update:modelValue="setFooterValue(field.key, $event ?? '')"
              @blur="touchedFooterFields[field.key] = true"
            />
            <ButtonBase
              fullWidth
              class="ReportMetaEditForm-Button"
              variant="page"
              :disabled="!formData.header.taxpayer.trim() || signatoriesMatchTaxpayer"
              @click="copyTaxpayerToSignatories"
            >
              {{ t('ui.reportBuilderMetaFields.responsiblePeople.sameAsTaxpayer') }}
            </ButtonBase>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.ReportMetaEditForm {
  display: flex;
  flex-direction: column;
}

.ReportMetaEditForm_Fieldset {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: min-content;
  row-gap: 24px;
  column-gap: 16px;
}

.ReportMetaEditForm_Fieldset_footer {
  grid-template-columns: 1fr 1fr auto;
}

.ReportMetaEditForm-SignatoriesHeader {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 24px 0 16px;
  justify-content: space-between;

  h3 {
    margin-right: auto;
  }
}

.ReportMetaEditForm-SignatoriesHintContainer {
  max-width: 100%;
  min-height: 24px;
}

.ReportMetaEditForm-Button {
  margin-top: 18px;
}

.ReportMetaEditForm-Collapse {
  display: grid;
  grid-template-rows: 1fr;
}

.ReportMetaEditForm-Content {
  min-height: 0;
}

.report-meta-collapse-enter-active,
.report-meta-collapse-leave-active {
  .ReportMetaEditForm-Content {
    overflow: hidden;
  }
}

.report-meta-collapse-enter-active {
  transition:
    grid-template-rows var(--transition-collapse-enter),
    opacity var(--transition-collapse-enter);
}

.report-meta-collapse-leave-active {
  transition:
    grid-template-rows var(--transition-collapse-leave),
    opacity var(--transition-collapse-leave);
}

.report-meta-collapse-enter-from,
.report-meta-collapse-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.ReportMetaEditForm-Counter {
  color: var(--neutral-600);
}

.ReportMetaEditForm-Counter_complete {
  color: var(--neutral-900);
}

.ReportMetaEditForm-Tittle {
  grid-area: title;
}

.ReportMetaEditForm-Info {
  grid-area: info;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  svg {
    flex-shrink: 0;
  }
}

.ReportMetaEditForm-Header {
  display: grid;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  grid-template-areas:
    'title toggle'
    'info counter';
}

.ReportMetaEditForm-Counter {
  grid-area: counter;
}

.ReportMetaEditForm-CollapseToggle {
  grid-area: toggle;
  justify-self: end;
}

@media (width <= 1024px) {
  .ReportMetaEditForm_Fieldset {
    grid-template-columns: repeat(2, 1fr);

    .ReportMetaEditForm-Button {
      margin-top: 0;
      grid-column: span 2;
    }
  }
}

@media (width <= 850px) {
  .ReportMetaEditForm-CounterLabel {
    display: none;
  }
  .ReportMetaEditForm-Counter {
    justify-self: end;
  }
}

@media (width <= 740px) {
  .ReportMetaEditForm-Counter {
    justify-self: start;
  }

  .ReportMetaEditForm-Header {
    grid-template-areas:
      'counter toggle'
      'title title'
      'info info';
  }

  .ReportMetaEditForm-CounterLabel {
    display: inline;
  }
  .ReportMetaEditForm_Fieldset {
    display: flex;
    gap: 24px;
    flex-direction: column;
  }

  .ReportMetaEditForm-Button {
    margin-top: 0;
  }
}

@media (width <= 450px) {
  .ReportMetaEditForm-CounterLabel {
    display: none;
  }
}
</style>
