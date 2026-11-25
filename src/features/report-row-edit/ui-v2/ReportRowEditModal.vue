<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/entities/report'
import { useLocale } from '@/shared/i18n'
import { useViewport } from '@/shared/lib'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { DividerBase } from '@/shared/ui-v2/divider-base'
import { IconDangerCircle } from '@/shared/ui-v2/icons'
import { ModalBase } from '@/shared/ui-v2/modal-base'
import ReportRowEditForm, { type ReportRowFormInitialValue, type ReportRowPayload } from './ReportRowEditForm.vue'

export type ReportRowEditModalMode = 'create' | 'edit'

type ReportRowEditModalProps = {
  /** Видимость модалки (v-model:open). */
  open: boolean
  /** Создание новой строки или редактирование существующей — влияет на заголовок. */
  mode?: ReportRowEditModalMode
  /** Начальные значения формы: строка для редактирования или копирования. */
  initialValue?: ReportRowFormInitialValue | null
}

const { open, mode = 'create', initialValue = null } = defineProps<ReportRowEditModalProps>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'submit', payload: ReportRowPayload): void
}>()

const { t } = useLocale()
const { activeYear } = storeToRefs(useReportStore())

// На мобилке кнопки остаются в одну строку, поэтому «Закрыть без сохранения» сокращаем до «Закрыть».
const viewport = useViewport()
const closeWithoutSavingLabel = computed(() =>
  viewport.value === 'mobile'
    ? t('ui.reportRowForm.closeWithoutSavingShort')
    : t('ui.reportRowForm.closeWithoutSaving'),
)

const formId = useId()
const formKey = ref(0)
const canSubmit = ref(false)
const isDirty = ref(false)
// Пользователь пытается закрыть форму с несохранёнными изменениями: показываем предупреждение
// и вместо «Отменить / Сохранить» — «Продолжить / Закрыть без сохранения».
const isConfirmingClose = ref(false)
// Предупреждать есть о чём, только когда изменения можно сохранить: форма изменена и «Сохранить» активна.
// Если сохранить нельзя (не все поля заполнены или есть ошибки), закрываем без вопросов.
const hasUnsavedChanges = computed(() => isDirty.value && canSubmit.value)

const title = computed(() =>
  mode === 'edit'
    ? t('ui.reportRowForm.titleEditYear', { year: activeYear.value })
    : t('ui.reportRowForm.titleAddYear', { year: activeYear.value }),
)

// При каждом открытии форма создаётся заново (новый key), состояние модалки сбрасываем.
watch(
  () => open,
  (isOpen) => {
    if (!isOpen) return
    formKey.value += 1
    canSubmit.value = false
    isDirty.value = false
    isConfirmingClose.value = false
  },
)

// Изменения откатили вручную или сохранить стало нельзя — предупреждать больше не о чем.
watch(hasUnsavedChanges, (value) => {
  if (!value) isConfirmingClose.value = false
})

// isConfirmingClose здесь не сбрасываем (это делается при следующем открытии): иначе правая кнопка
// успеет снова стать type="submit" до того, как браузер обработает клик, и форма отправится.
// Заодно во время анимации закрытия предупреждение и кнопки не мелькают.
function close() {
  emit('update:open', false)
}

// «Отменить», крестик и Esc: если сохранять нечего — закрываем сразу, иначе просим подтвердить.
function requestClose() {
  if (hasUnsavedChanges.value) {
    isConfirmingClose.value = true
    return
  }
  close()
}

function handleOpenUpdate(value: boolean) {
  if (value) emit('update:open', true)
  else requestClose()
}

function continueEditing() {
  isConfirmingClose.value = false
}

function handleSubmit(payload: ReportRowPayload) {
  isConfirmingClose.value = false
  emit('submit', payload)
}
</script>

<template>
  <ModalBase :open="open" :title="title" shouldCloseOnEsc hasCloseButton @update:open="handleOpenUpdate">
    <ReportRowEditForm
      :key="formKey"
      :id="formId"
      :initial-value="initialValue"
      @update:can-submit="canSubmit = $event"
      @update:is-dirty="isDirty = $event"
      @submit="handleSubmit"
    />
    <DividerBase class="ReportRowEditModal-Divider" />

    <!-- Предупреждение плавно раскрывается, вместе с ним плавно меняется высота модалки. -->
    <Transition name="report-row-unsaved">
      <div v-if="isConfirmingClose" class="ReportRowEditModal-Unsaved">
        <div class="ReportRowEditModal-UnsavedContent">
          <div class="ReportRowEditModal-Warning u-typo-label-s" role="alert">
            <IconDangerCircle size="s" class="ReportRowEditModal-WarningIcon" />
            {{ t('ui.reportRowForm.unsavedChangesWarning') }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- Кнопки не пересоздаём, а меняем им текст и действие: фокус остаётся на той же кнопке. -->
    <div class="ReportRowEditModal-Actions">
      <ButtonBase variant="page" size="m" full-width @click="isConfirmingClose ? continueEditing() : requestClose()">
        {{ isConfirmingClose ? t('ui.reportRowForm.continueEditing') : t('ui.reportRowForm.cancel') }}
      </ButtonBase>
      <!-- Одна кнопка, а не две через v-if: так фон и рамка плавно перетекают из акцентного цвета в красный
           (transition в ButtonBase). В режиме подтверждения это обычная кнопка, а не отправка формы. -->
      <ButtonBase
        :variant="isConfirmingClose ? 'danger' : 'accent'"
        size="m"
        :type="isConfirmingClose ? 'button' : 'submit'"
        :form="isConfirmingClose ? undefined : formId"
        :disabled="!isConfirmingClose && !canSubmit"
        full-width
        @click="isConfirmingClose && close()"
      >
        {{ isConfirmingClose ? closeWithoutSavingLabel : t('ui.reportRowForm.submit') }}
      </ButtonBase>
    </div>
  </ModalBase>
</template>

<style scoped lang="scss">
.ReportRowEditModal-Divider {
  margin-block: 24px;
}

.ReportRowEditModal-Unsaved {
  display: grid;
  grid-template-rows: 1fr;
}

.ReportRowEditModal-UnsavedContent {
  min-height: 0;
}

.ReportRowEditModal-Warning {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--orange-400);
  // Отступы внутри сворачиваемого блока, чтобы они схлопывались вместе с текстом.
  margin-bottom: 24px;
}

.ReportRowEditModal-WarningIcon {
  flex-shrink: 0;
}

.ReportRowEditModal-Actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.report-row-unsaved-enter-active,
.report-row-unsaved-leave-active {
  .ReportRowEditModal-UnsavedContent {
    overflow: hidden;
  }
}

.report-row-unsaved-enter-active {
  transition:
    grid-template-rows var(--transition-collapse-enter),
    opacity var(--transition-collapse-enter);
}

.report-row-unsaved-leave-active {
  transition:
    grid-template-rows var(--transition-collapse-leave),
    opacity var(--transition-collapse-leave);
}

.report-row-unsaved-enter-from,
.report-row-unsaved-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
</style>
