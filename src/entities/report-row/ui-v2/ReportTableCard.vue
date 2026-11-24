<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { TagBase } from '@/shared/ui-v2/tag-base'
import { DialogConfirm } from '@/shared/ui-v2/dialog-confirm'
import type { ReportRow } from '../model/types'
import { getRowTotals, isForeignCurrencyRow } from '../model/lib'
import { ROW_HIGHLIGHT_DURATION_MS } from '../model/constants'
import { formatDateForUi, formatMoneySafe } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import type { I18nLocale } from '@/shared/i18n'
import { IconPen, IconTrash, IconCopy } from '@/shared/ui-v2/icons'
import { ActionMenu, type ActionMenuItem } from '@/shared/ui-v2/action-menu'

type ReportTableCardProps = {
  index: number
  row: ReportRow
  locale: I18nLocale
  /** Значение grid-template-columns. Передаётся таблицей, чтобы совпадать с сеткой шапки.
   * Без него используется сетка по умолчанию из стилей. */
  columns?: string
  /** Подсветить строку (новая или переместившаяся после смены даты): жёлтый фон, затем затухание. */
  highlighted?: boolean
}

const props = withDefaults(defineProps<ReportTableCardProps>(), { highlighted: false })
const { t } = useLocale()

const emit = defineEmits<{
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const currencyLabel = computed(() => props.row.currency ?? '')
// У строк в RSD суммы в валюте не показываем — в этих графах прочерк.
const hasCurrency = computed(() => isForeignCurrencyRow(props.row))

const totals = computed(() => getRowTotals(props.row))
const totalForeign = computed(() => totals.value.foreignCents)
const totalRsd = computed(() => totals.value.rsdCents)

const displayTotalForeign = computed(() =>
  hasCurrency.value ? formatMoneySafe(totalForeign.value, { showMinorZeros: true, locale: props.locale }) : '',
)

const displayTotalRsd = computed(() => formatMoneySafe(totalRsd.value, { showMinorZeros: true, locale: props.locale }))
const deleteRowDetails = computed(() => {
  const summary = [formatDateForUi(props.row.date), props.row.description].filter(Boolean).join(', ')
  const totals = hasCurrency.value
    ? `${displayTotalForeign.value || '-'}\u00A0${currencyLabel.value} (${displayTotalRsd.value}\u00A0RSD)?`
    : `${displayTotalRsd.value}\u00A0RSD?`

  return ['Вы уверены, что хотите удалить:', summary, '-', totals].filter(Boolean).join(' ')
})

const openDialogConfirm = ref(false)

const rootRef = useTemplateRef<HTMLElement>('root')

// Подсвеченная строка могла уехать за пределы экрана (добавлена в конец или сменила место по дате) — докручиваем к ней.
watch(
  () => props.highlighted,
  async (isHighlighted) => {
    if (!isHighlighted) return
    await nextTick()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rootRef.value?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
  },
  { immediate: true },
)

function closeDialogConfirm() {
  openDialogConfirm.value = false
}

function handleClearRow() {
  emit('remove', props.row.id)
  closeDialogConfirm()
}

const menuItems = computed<ActionMenuItem[]>(() => [
  { value: 'edit', label: t('ui.reportBuilderIncomeRecordsRow.edit'), icon: IconPen },
  { value: 'copy', label: t('ui.reportBuilderIncomeRecordsRow.copy'), icon: IconCopy },
  { value: 'remove', label: t('ui.reportBuilderIncomeRecordsRow.remove'), icon: IconTrash, danger: true },
])

function handleMenuSelect(value: string) {
  if (value === 'edit') emit('edit', props.row.id)
  else if (value === 'copy') emit('copy', props.row.id)
  else if (value === 'remove') openDialogConfirm.value = true
}
</script>

<template>
  <div
    ref="root"
    class="ReportTableCard u-typo-body-small-l"
    :class="{ ReportTableCard_highlighted: highlighted }"
    :style="{ gridTemplateColumns: columns, animationDuration: `${ROW_HIGHLIGHT_DURATION_MS}ms` }"
    @click="emit('edit', row.id)"
  >
    <div class="ReportTableCard_Header">
      <div>
        <span class="ReportTableCard_Number"> {{ index + 1 }}. </span>
        <span>
          {{ formatDateForUi(row.date) }}
        </span>
      </div>

      <div class="ReportTableCard_Menu" @click.stop>
        <ActionMenu
          :items="menuItems"
          :ariaLabel="t('ui.reportBuilderIncomeRecordsRow.actions')"
          @select="handleMenuSelect"
        />
      </div>
    </div>
    <div class="ReportTableCard_Description u-typo-body-small-s">
      {{ row.description }}
    </div>

    <div class="ReportTableCard_Footer">
      <div class="ReportTableCard_Currensy">
        <TagBase size="small" :label="currencyLabel || 'RSD'" />
        <span class="ReportTableCard_Income u-typo-label-m">{{ displayTotalForeign || '-' }}</span>
      </div>
      <div class="ReportTableCard_Local">
        <span class="ReportTableCard_Income u-typo-label-m">{{ displayTotalRsd }} RSD</span>
      </div>
    </div>

    <DialogConfirm
      v-model:open="openDialogConfirm"
      @confirm="handleClearRow"
      :title="t('ui.deleteRowModal.title')"
      :message="deleteRowDetails"
      :details="t('ui.deleteRowModal.description')"
      :labelPrimaryButton="t('ui.deleteRowModal.confirm')"
      :labelSecondaryButton="t('ui.deleteRowModal.cancel')"
      type="delete"
    >
      <!--      <template v-if="deleteRowDetails" #content>
        {{ deleteRowDetails }}
      </template>-->
    </DialogConfirm>
  </div>
</template>

<style scoped lang="scss">
.ReportTableCard {
  border-bottom: 1px solid #6e777840;
  // Карточка, к которой докручиваем (подсветка новой записи), не должна прятаться под липкими кнопками.
  scroll-margin-top: calc(var(--report-table-sticky-top, 0px) + 24px);
  transition: background-color var(--transition-color);
  cursor: pointer;

  padding: 8px 16px 16px;

  // Подсветка как при ховере, когда по табу сфокусирована кнопка внутри строки.
  &:hover,
  &:has(:focus-visible) {
    background: var(--neutral-100);
  }

  &:active {
    background: var(--neutral-200);
  }

  // Длительность задаётся инлайном из ROW_HIGHLIGHT_DURATION_MS — по ней же таблица снимает подсветку.
  // Фон в 5 раз шире строки: прозрачно | переход | жёлтый | переход | прозрачно, каждый участок — ширина строки.
  // Сдвигая background-position, проводим жёлтую полосу через строку слева направо.
  &_highlighted {
    background-image: linear-gradient(
      to right,
      transparent 20%,
      var(--yellow-400) 40%,
      var(--yellow-400) 60%,
      transparent 80%
    );
    background-size: 500% 100%;
    background-repeat: no-repeat;
    background-position-x: 0%;
    animation-name: ReportTableCard-highlight;
  }

  &_IncomeDetails {
    display: grid;
    grid-template-rows: 1fr;
    color: var(--neutral-600);
  }

  &_IncomeLabel {
    display: inline-block;
    padding-right: 8px;
    min-width: 40px;
  }

  &_IncomeDetailsContent {
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    span {
      padding-bottom: 4px;
    }
  }

  &_Description {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    overflow-wrap: anywhere;
    padding-bottom: 16px;
  }

  &_Column {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &_type {
      &_description {
        align-items: flex-start;
        // Иначе grid-ячейка растягивается под длинный текст и обрезка не срабатывает.
        min-width: 0;
      }

      &_income {
        align-items: flex-start;
      }

      &_date {
        padding-inline: 0;
        margin-right: auto;
      }

      &_actions {
        padding: 4px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.ReportTableCard_Header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  color: var(--neutral-600);
}

.ReportTableCard_Number {
  padding-right: 8px;
}

.ReportTableCard_Menu {
  margin-left: auto;
}

.ReportTableCard_Footer {
  display: flex;
  justify-content: space-between;
}
.ReportTableCard_Currensy {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ReportTableCard_Income {
  padding-top: 1px;
}

// Из 3,5 с: 0,5 с полоса въезжает слева (≈14%), затем 3 с цвет постепенно уходит градиентом вправо.
// 100% — справа от полосы (прозрачно), 50% — полоса во всю строку, 0% — слева от полосы (прозрачно).
@keyframes ReportTableCard-highlight {
  0% {
    background-position-x: 100%;
    animation-timing-function: ease-out;
  }

  14% {
    background-position-x: 50%;
    animation-timing-function: ease-in-out;
  }

  100% {
    background-position-x: 0%;
  }
}

.income-details-enter-active,
.income-details-leave-active {
  transition:
    grid-template-rows 200ms ease,
    opacity 200ms ease;
}

.income-details-enter-from,
.income-details-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .income-details-enter-active,
  .income-details-leave-active {
    transition: none;
  }
}
</style>
