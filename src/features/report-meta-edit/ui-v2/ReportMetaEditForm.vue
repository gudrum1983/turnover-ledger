<script setup lang="ts">
import { FieldBase } from '@/shared/ui-v2/field-base'
import { FieldDigit } from '@/shared/ui-v2/field-digit'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import {
  FOOTER_META_FIELDS,
  HEADER_META_FIELDS,
  getHeaderFieldWarning,
  getPersonNameWarning,
  useReportStore,
} from '@/entities/report'
import type { FooterField, HeaderField } from '@/entities/report'
import { getReportMetaExample, useReportScriptStore } from '@/entities/report-script'
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
const reportScriptStore = useReportScriptStore()

// Адрес и код деятельности — примером тем же письмом, что и отчёт; остальное — из словаря интерфейса.
function headerPlaceholder(field: (typeof HEADER_META_FIELDS)[number]) {
  return getReportMetaExample(field.key, reportScriptStore.script) ?? t(field.placeholderKey)
}

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

// Предупреждение (жёлтое) — после ухода из поля и только для непустого значения. Печать не блокирует.
function fieldWarning(field: HeaderField) {
  const value = formData.value.header[field]
  if (!touchedFields.value[field] || !value.trim()) return undefined
  const key = getHeaderFieldWarning(field, value)
  return key ? t(key) : undefined
}

function footerFieldWarning(field: FooterField) {
  const value = formData.value.footer[field]
  if (!touchedFooterFields.value[field] || !value.trim()) return undefined
  const key = getPersonNameWarning(value)
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

// Липкая шапка (на узком экране): пока она прилипла к верху окна, у неё белый фон.
// Нулевой маркер стоит прямо перед шапкой: ушёл за верх окна — шапка прилипла.
const stickySentinel = useTemplateRef<HTMLElement>('stickySentinel')
const isHeaderStuck = ref(false)
let stickyObserver: IntersectionObserver | undefined

onMounted(() => {
  if (!stickySentinel.value) return
  stickyObserver = new IntersectionObserver(([entry]) => {
    isHeaderStuck.value = Boolean(entry && !entry.isIntersecting && entry.boundingClientRect.top < 0)
  })
  stickyObserver.observe(stickySentinel.value)
})

onBeforeUnmount(() => stickyObserver?.disconnect())

// «Скрыть» в прилипшей шапке: поля свернутся, и страница окажется где-то ниже блока реквизитов.
// Поэтому плавно возвращаемся к началу блока, а сворачивать начинаем на половине прокрутки.
// Шапка остаётся липкой, пока идёт сворачивание (isStickyEnabled снимается после анимации),
// поэтому сама встаёт на место без рывка.
// Прокручиваем сами: у behavior: 'smooth' не узнать длительность, а сворачивание нужно начать на её середине.
const rootRef = useTemplateRef<HTMLElement>('root')
const SCROLL_TO_BLOCK_MS = 500
const isStickyEnabled = ref(true)
let scrollFrame: number | undefined

const easeInOutCubic = (progress: number) => (progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2)

function scrollToBlock(onHalf: () => void) {
  const root = rootRef.value
  if (!root) return onHalf()

  const startY = window.scrollY
  const offset = parseFloat(getComputedStyle(root).scrollMarginTop) || 0
  const targetY = Math.max(0, startY + root.getBoundingClientRect().top - offset)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    window.scrollTo(0, targetY)
    return onHalf()
  }

  const startTime = performance.now()
  let halfReached = false
  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / SCROLL_TO_BLOCK_MS)
    window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(progress))
    if (!halfReached && progress >= 0.5) {
      halfReached = true
      onHalf()
    }
    scrollFrame = progress < 1 ? requestAnimationFrame(step) : undefined
  }
  scrollFrame = requestAnimationFrame(step)
}

function handleToggle(isOpen: boolean) {
  if (isOpen) isStickyEnabled.value = true
  if (isOpen || !isHeaderStuck.value) {
    isOpenHeader.value = isOpen
    return
  }
  if (scrollFrame !== undefined) return

  scrollToBlock(() => {
    isOpenHeader.value = false
  })
}

onBeforeUnmount(() => {
  if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame)
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
  <div ref="root" class="ReportMetaEditForm">
    <div ref="stickySentinel" class="ReportMetaEditForm-StickySentinel" aria-hidden="true" />
    <!-- Липкая только у раскрытого блока: у свёрнутого прокручивать нечего.
         При сворачивании липкость снимается после анимации — иначе шапка прыгает. -->
    <div
      class="ReportMetaEditForm-Header"
      :class="{
        'ReportMetaEditForm-Header_sticky': isStickyEnabled,
        'ReportMetaEditForm-Header_stuck': isStickyEnabled && isHeaderStuck,
      }"
    >
      <h3 class="ReportMetaEditForm-Tittle u-typo-h1-l">Реквизиты документа</h3>
      <!-- На десктопе строка про локальную обработку — в сетке шапки, на узком экране — под липкой шапкой:
           в прилипшей шапке её нет (макет «Details block»). -->
      <div class="ReportMetaEditForm-Info ReportMetaEditForm-Info_inHeader u-typo-label-s">
        <IconInfoCircle size="s" />
        <span>
          Все данные обрабатываются локально в вашем браузере
          <LinkBase :to="{ name: ROUTES.about.name }">подробнее</LinkBase>
        </span>
      </div>
      <CollapseToggle
        class="ReportMetaEditForm-CollapseToggle"
        :model-value="isOpenHeader"
        @update:model-value="handleToggle"
      />
      <span
        class="ReportMetaEditForm-Counter u-typo-body-small-m"
        :class="{ 'ReportMetaEditForm-Counter_complete': metaFieldsProgress.filled === metaFieldsProgress.total }"
      >
        <span class="ReportMetaEditForm-CounterLabel">заполнено полей: </span>
        {{ metaFieldsProgress.filled }} из {{ metaFieldsProgress.total }}
      </span>
    </div>
    <div class="ReportMetaEditForm-Info ReportMetaEditForm-Info_belowHeader u-typo-label-s">
      <IconInfoCircle size="s" />
      <span>
        Все данные обрабатываются локально в вашем браузере
        <LinkBase :to="{ name: ROUTES.about.name }">подробнее</LinkBase>
      </span>
    </div>

    <Transition name="report-meta-collapse" @after-leave="isStickyEnabled = false">
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
              :name="field.key"
              :label="t(field.labelKey)"
              :placeholder="headerPlaceholder(field)"
              :hint="t(field.hintKey) || undefined"
              :modelValue="formData.header[field.key]"
              :max-length="field.key === 'pib' || field.key === 'taxNumber' ? 13 : undefined"
              :warning="Boolean(fieldWarning(field.key))"
              :warning-message="fieldWarning(field.key)"
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
              :name="field.key"
              :label="t(field.labelKey)"
              :placeholder="t(field.placeholderKey)"
              :hint="t(field.hintKey) || undefined"
              :modelValue="formData.footer[field.key]"
              :warning="Boolean(footerFieldWarning(field.key))"
              :warning-message="footerFieldWarning(field.key)"
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
  // При прокрутке к блоку виден и верхний отступ карточки, а не только заголовок.
  scroll-margin-top: calc(var(--paper-block-padding-block, 0px) + 16px);
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
    // Строка про локальную обработку на узком экране — под шапкой (ReportMetaEditForm-Info_belowHeader).
    grid-template-areas:
      'counter toggle'
      'title title';
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

// Вне узкого экрана строка под шапкой не нужна — она в сетке шапки.
.ReportMetaEditForm-Info_belowHeader {
  display: none;
}

.ReportMetaEditForm-StickySentinel {
  height: 0;
}

// Липкая шапка на узком экране (макет «Details block»): счётчик, «Скрыть» и заголовок остаются
// у верха окна, пока прокручиваются поля. Прилипшая — белая плашка во всю ширину карточки.
@media (width <= 740px) {
  .ReportMetaEditForm-Header_sticky {
    position: sticky;
    top: 0;
    // Выше тултипов полей (z-index: 10), которые уезжают под шапку.
    z-index: 11;
  }

  .ReportMetaEditForm-Header {
    // Выходим к краям карточки, чтобы белая плашка была во всю её ширину; контент остаётся на месте.
    margin-inline: calc(-1 * var(--paper-block-padding-inline, 0px));
    padding: 8px var(--paper-block-padding-inline, 0px) 16px;
    border-radius: 0 0 var(--radius-paper-block, 32px) var(--radius-paper-block, 32px);
    transition: background-color var(--transition-color);
  }

  .ReportMetaEditForm-Header_stuck {
    background: var(--white);
  }

  .ReportMetaEditForm-Info_inHeader {
    display: none;
  }

  .ReportMetaEditForm-Info_belowHeader {
    display: flex;
    // Шапка снизу отступает на 16px, а строка в макете стоит в 8px от заголовка.
    margin-top: -8px;
  }

  // При переходе по полям с клавиатуры поле не должно прятаться под липкой шапкой.
  .ReportMetaEditForm-Content :deep(input) {
    scroll-margin-top: 120px;
  }
}

@media (width <= 450px) {
  .ReportMetaEditForm-CounterLabel {
    display: none;
  }
}
</style>
