<script setup lang="ts">
import { computed, ref } from 'vue'
import { TagBase } from '@/shared/ui-v2/tag-base'
import { DialogConfirm } from '@/shared/ui/dialog-confirm'
import type { ReportRow } from '../model/types'
import { getRowTotals } from '../model/lib'
import { formatDateForUi, formatMoneySafe } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import type { I18nLocale } from '@/shared/i18n'
import { ButtonIcon } from '@/shared/ui-v2/button-icon'
import { IconPen, IconTrash, IconCopy } from '@/shared/ui-v2/icons'

type ReportTableRowProps = {
  index: number
  size: 'full' | 'short'
  row: ReportRow
  locale: I18nLocale
}

const props = defineProps<ReportTableRowProps>()
const { t } = useLocale()

const emit = defineEmits<{
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

/*const isEven = computed(() => props.index % 2 === 0)*/

const isShort = computed(() => props.size === 'short')

const currencyLabel = computed(() => props.row.currency ?? '')
const hasCurrency = computed(() => Boolean(props.row.currency))

const goodsForeign = computed(() => props.row.amounts.goods.foreignCents ?? 0)
const servicesForeign = computed(() => props.row.amounts.services.foreignCents ?? 0)
const goodsRsd = computed(() => props.row.amounts.goods.rsdCents)
const servicesRsd = computed(() => props.row.amounts.services.rsdCents)

const totals = computed(() => getRowTotals(props.row))
const totalForeign = computed(() => totals.value.foreignCents)
const totalRsd = computed(() => totals.value.rsdCents)

const displayGoodsForeign = computed(() =>
  hasCurrency.value ? formatMoneySafe(goodsForeign.value, { showMinorZeros: true, locale: props.locale }) : '',
)
const displayServicesForeign = computed(() =>
  hasCurrency.value ? formatMoneySafe(servicesForeign.value, { showMinorZeros: true, locale: props.locale }) : '',
)
const displayTotalForeign = computed(() =>
  hasCurrency.value ? formatMoneySafe(totalForeign.value, { showMinorZeros: true, locale: props.locale }) : '',
)

const displayGoodsRsd = computed(() => formatMoneySafe(goodsRsd.value, { showMinorZeros: true, locale: props.locale }))
const displayServicesRsd = computed(() =>
  formatMoneySafe(servicesRsd.value, { showMinorZeros: true, locale: props.locale }),
)
const displayTotalRsd = computed(() => formatMoneySafe(totalRsd.value, { showMinorZeros: true, locale: props.locale }))
const deleteRowDetails = computed(() => {
  const summary = [formatDateForUi(props.row.date), props.row.description].filter(Boolean).join(', ')
  const totals = hasCurrency.value
    ? `${displayTotalForeign.value || '-'} ${currencyLabel.value} (${displayTotalRsd.value} RSD)`
    : `${displayTotalRsd.value} RSD`

  return [summary, totals].filter(Boolean).join(' - ')
})

const openDialogConfirm = ref(false)

function closeDialogConfirm() {
  openDialogConfirm.value = false
}

function handleClearRow() {
  emit('remove', props.row.id)
  closeDialogConfirm()
}
</script>

<template>
  <div class="ReportTableRow u-typo-label-s" :class="{ ReportTableRow_short: isShort }" @click="emit('edit', row.id)">
    <div class="ReportTableRow_Column ReportTableRow_Column_type_number">
      {{ index + 1 }}
    </div>
    <div class="ReportTableRow_Column">
      {{ formatDateForUi(row.date) }}
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_description">
      <div class="ReportTableRow_Description">
        {{ row.description }}
      </div>
    </div>
    <div class="ReportTableRow_Column">
      <TagBase :label="currencyLabel || 'RSD'" />
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income">
      <Transition name="income-details">
        <div v-if="!isShort" class="ReportTableRow_IncomeDetails">
          <div class="ReportTableRow_IncomeDetailsContent">
            <div>
              <span class="ReportTableRow_IncomeLabel">
                {{ t('ui.reportBuilderIncomeRecordsRow.goodsShort') }}
              </span>
              <span>{{ displayGoodsForeign || '-' }}</span>
            </div>
            <div>
              <span class="ReportTableRow_IncomeLabel">
                {{ t('ui.reportBuilderIncomeRecordsRow.servicesShort') }}
              </span>
              <span>{{ displayServicesForeign || '-' }}</span>
            </div>
          </div>
        </div>
      </Transition>

      <div>
        <span v-if="!isShort" class="ReportTableRow_IncomeLabel">{{
          t('ui.reportBuilderIncomeRecordsRow.subtotalShort')
        }}</span>
        <span :class="isShort ? 'u-typo-label-m' : 'u-typo-label-l'">{{ displayTotalForeign || '-' }}</span>
      </div>
    </div>

    <div class="ReportTableRow_Column ReportTableRow_Column_type_income">
      <Transition name="income-details">
        <div v-if="!isShort" class="ReportTableRow_IncomeDetails">
          <div class="ReportTableRow_IncomeDetailsContent">
            <div>
              <span class="ReportTableRow_IncomeLabel"> {{ t('ui.reportBuilderIncomeRecordsRow.goodsShort') }} </span>
              <span class="Text_AlginRight">{{ displayGoodsRsd }}</span>
            </div>
            <div>
              <span class="ReportTableRow_IncomeLabel">
                {{ t('ui.reportBuilderIncomeRecordsRow.servicesShort') }}
              </span>
              <span>{{ displayServicesRsd }}</span>
            </div>
          </div>
        </div>
      </Transition>

      <div>
        <span v-if="!isShort" class="ReportTableRow_IncomeLabel">{{
          t('ui.reportBuilderIncomeRecordsRow.subtotalShort')
        }}</span>
        <span :class="isShort ? 'u-typo-label-m' : 'u-typo-label-l'">{{ displayTotalRsd }}</span>
      </div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_actions" @click.stop>
      <ButtonIcon
        :ariaLabel="t('ui.reportBuilderIncomeRecordsRow.edit')"
        size="m"
        variant="card"
        @click="emit('edit', row.id)"
      >
        <IconPen size="s" />
      </ButtonIcon>

      <ButtonIcon
        :ariaLabel="t('ui.reportBuilderIncomeRecordsRow.copy')"
        size="m"
        variant="card"
        @click="emit('copy', row.id)"
      >
        <IconCopy size="s" />
      </ButtonIcon>

      <ButtonIcon
        :ariaLabel="t('ui.reportBuilderIncomeRecordsRow.remove')"
        size="m"
        variant="danger-card"
        @click="openDialogConfirm = true"
      >
        <IconTrash size="s" />
      </ButtonIcon>

      <!--      <ReportTableRowButton
        :size="size"
        icon="edit"
        :label="t('ui.reportBuilderIncomeRecordsRow.edit')"
        @click="emit('edit', row.id)"
      />
      <ReportTableRowButton
        :size="size"
        icon="copy"
        :label="t('ui.reportBuilderIncomeRecordsRow.copy')"
        @click="emit('copy', row.id)"
      />
      <ReportTableRowButton
        :size="size"
        icon="trash"
        :label="t('ui.reportBuilderIncomeRecordsRow.remove')"
        @click="openDialogConfirm = true"
      />-->
    </div>
    <DialogConfirm
      v-model:open="openDialogConfirm"
      @confirm="handleClearRow"
      :title="t('ui.deleteRowModal.title')"
      :message="t('ui.deleteRowModal.description')"
      :labelActiveButton="t('ui.deleteRowModal.confirm')"
      :labelCancelButton="t('ui.deleteRowModal.cancel')"
      type="delete"
    >
      <template v-if="deleteRowDetails" #content>
        {{ deleteRowDetails }}
      </template>
    </DialogConfirm>
  </div>
</template>

<style scoped lang="scss">
.ReportTableRow {
  display: grid;
  grid-template-columns: 60px 120px auto 180px 180px 180px 144px;
  border-bottom: 1px solid #6e777840;
  transition: background-color var(--transition-color);
  cursor: pointer;

  &:hover {
    background: var(--neutral-100);
  }

  &:active {
    background: var(--neutral-200);
  }

  &_short {
    .ReportTableRow_Description {
    }
    .ReportTableRow_Column_type_actions {
      flex-direction: row;
    }
    .ReportTableRow_Column_type_income {
      align-items: center;
    }
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
  }

  &_Column {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &_type {
      &_number {
        text-align: center;
        font-weight: 600;
      }

      &_description {
        align-items: flex-start;
      }

      &_income {
        align-items: flex-start;
      }

      &_actions {
        padding: 6px 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 4px;
      }
    }
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
