<script setup lang="ts">
import { FieldBase } from '@/shared/ui-v2/field-base'
import { FieldDigit } from '@/shared/ui-v2/field-digit'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { FOOTER_META_FIELDS, HEADER_META_FIELDS, useReportStore } from '@/entities/report'
import { useLocale } from '@/shared/i18n'
import { IconInfoCircle } from '@/shared/ui-v2/icons'
import { LinkBase } from '@/shared/ui-v2/link-base'
import { ROUTES } from '@/shared/constants/routes.ts'
import CollapseToggle from '@/features/report-meta-edit/ui-v2/CollapseToggle.vue'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import SignatoriesHint from './SignatoriesHint.vue'

const store = useReportStore()
const { formData, metaFieldsProgress } = storeToRefs(store)
const { setHeaderValue, setFooterValue } = store
const { t } = useLocale()

const isOpenHeader = ref(true)

const taxpayerName = computed(() => formData.value.header.taxpayer.trim())
const useTaxpayerForSignatories = ref(
  formData.value.footer.preparedBy === taxpayerName.value &&
    formData.value.footer.responsiblePerson === taxpayerName.value,
)
const signatoriesHint = computed(() => {
  return t(
    useTaxpayerForSignatories.value
      ? 'ui.reportBuilderMetaFields.responsiblePeople.taxpayerHint'
      : 'ui.reportBuilderMetaFields.responsiblePeople.separateHint',
  )
})
const signatoriesButtonLabel = computed(() =>
  t(
    useTaxpayerForSignatories.value
      ? 'ui.reportBuilderMetaFields.responsiblePeople.editSeparately'
      : 'ui.reportBuilderMetaFields.responsiblePeople.sameAsTaxpayer',
  ),
)
function toggleTaxpayerForSignatories() {
  useTaxpayerForSignatories.value = !useTaxpayerForSignatories.value
}

watch(
  [useTaxpayerForSignatories, taxpayerName],
  ([enabled, name]) => {
    if (!enabled) return

    setFooterValue('preparedBy', name)
    setFooterValue('responsiblePerson', name)
  },
  { flush: 'sync' },
)
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
              :debounce-ms="field.key === 'taxpayer' ? 0 : undefined"
              @update:modelValue="setHeaderValue(field.key, $event ?? '')"
            />
          </div>
          <div class="ReportMetaEditForm-SignatoriesHeader">
            <h3 class="u-typo-subtitle-l">
              {{ t('ui.reportBuilderSections.responsiblePeople') }}
            </h3>
            <div class="ReportMetaEditForm-SignatoriesHintContainer" aria-live="polite">
              <Transition name="fade" mode="out-in">
                <SignatoriesHint
                  :key="signatoriesHint"
                  :automatic="useTaxpayerForSignatories"
                  :text="signatoriesHint"
                />
              </Transition>
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
              :readonly="useTaxpayerForSignatories"
              @update:modelValue="!useTaxpayerForSignatories && setFooterValue(field.key, $event ?? '')"
            />
            <ButtonBase
              fullWidth
              class="ReportMetaEditForm-Button"
              variant="page"
              :aria-pressed="useTaxpayerForSignatories"
              :aria-label="signatoriesButtonLabel"
              @click="toggleTaxpayerForSignatories"
            >
              <span class="ReportMetaEditForm-ButtonLabel" aria-hidden="true">
                <span class="ReportMetaEditForm-ButtonLabelSizer">{{
                  t('ui.reportBuilderMetaFields.responsiblePeople.editSeparately')
                }}</span>
                <span class="ReportMetaEditForm-ButtonLabelSizer">{{
                  t('ui.reportBuilderMetaFields.responsiblePeople.sameAsTaxpayer')
                }}</span>
                <Transition name="report-meta-button-label" mode="out-in">
                  <span :key="signatoriesButtonLabel" class="ReportMetaEditForm-ButtonLabelText">
                    {{ signatoriesButtonLabel }}
                  </span>
                </Transition>
              </span>
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
  grid-template-columns: 1fr 1fr 300px;
}

.ReportMetaEditForm-SignatoriesHeader {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 24px 0 16px;
  justify-content: space-between;
}

.ReportMetaEditForm-SignatoriesHintContainer {
  margin-left: auto;
  max-width: 100%;
  min-height: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.ReportMetaEditForm-Button {
  align-self: end;
}

.ReportMetaEditForm-ButtonLabel {
  display: grid;
  width: 100%;
  overflow: hidden;
}

.report-meta-button-label-enter-active,
.report-meta-button-label-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.report-meta-button-label-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.report-meta-button-label-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

@media (prefers-reduced-motion: reduce) {
  .report-meta-button-label-enter-active,
  .report-meta-button-label-leave-active {
    transition: none;
  }
}

.ReportMetaEditForm-ButtonLabelSizer,
.ReportMetaEditForm-ButtonLabelText {
  grid-area: 1 / 1;
  align-self: center;
}

.ReportMetaEditForm-ButtonLabelSizer {
  visibility: hidden;
  pointer-events: none;
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
    button {
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
}

@media (width <= 450px) {
  .ReportMetaEditForm-CounterLabel {
    display: none;
  }
}
</style>
