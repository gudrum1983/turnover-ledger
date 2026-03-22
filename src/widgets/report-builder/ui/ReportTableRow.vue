<script setup lang="ts">
import { computed, ref } from 'vue'
import { DividerBase } from '@/shared/ui/divider-base'
import { TagBase } from '@/shared/ui/tag-base'
import { DialogConfirm } from '@/shared/ui/dialog-confirm'
import ReportTableRowButton from '@/widgets/report-builder/ui/ReportTableRowButton.vue'
import type { ReportRow } from '@/shared/types/report.ts'
import { formatDateForUi, formatMoneySafe, getRowTotals } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import type { I18nLocale } from '@/shared/i18n'

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

const isEven = computed(() => props.index % 2 === 0)

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
  <div class="ReportTableRow" :class="{ ReportTableRow_even: isEven, ReportTableRow_short: isShort }">
    <div class="ReportTableRow_Column ReportTableRow_Column_type_number">
      {{ index + 1 }}
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_description">
      <div class="ReportTableRow_Description">
        <TagBase class="ReportTableRow_Tag" :label="currencyLabel || 'RSD'" />
        {{ [formatDateForUi(row.date), row.description].filter(Boolean).join(', ') }}
      </div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income">
      <div v-if="!isShort">{{ t('ui.reportTableRow.goodsShort') }}</div>
      <DividerBase v-if="!isShort" color="table-cell" line-style="dotted" />
      <div v-if="!isShort">{{ t('ui.reportTableRow.servicesShort') }}</div>
      <DividerBase v-if="!isShort" color="table-cell" line-style="dotted" />
      <div>{{ t('ui.reportTableRow.subtotalShort') }}</div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income ReportTableRow_Column_font_secondary">
      <div v-if="!isShort">{{ displayGoodsForeign || '-' }}</div>
      <DividerBase v-if="!isShort" color="table-cell" line-style="dotted" />
      <div v-if="!isShort">{{ displayServicesForeign || '-' }}</div>
      <DividerBase v-if="!isShort" color="table-cell" line-style="dotted" />
      <div class="Typo_BodyAccent">{{ displayTotalForeign || '-' }}</div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income">
      <div v-if="!isShort" class="Text_AlginRight">{{ displayGoodsRsd }}</div>
      <DividerBase v-if="!isShort" color="table-cell" line-style="dotted" />
      <div v-if="!isShort">{{ displayServicesRsd }}</div>
      <DividerBase v-if="!isShort" color="table-cell" line-style="dotted" />
      <div class="Typo_BodyAccent">{{ displayTotalRsd }}</div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_actions">
      <ReportTableRowButton
        :size="size"
        icon="edit"
        :label="t('ui.reportTableRow.edit')"
        @click="emit('edit', row.id)"
      />
      <ReportTableRowButton
        :size="size"
        icon="copy"
        :label="t('ui.reportTableRow.copy')"
        @click="emit('copy', row.id)"
      />
      <ReportTableRowButton
        :size="size"
        icon="trash"
        :label="t('ui.reportTableRow.remove')"
        @click="openDialogConfirm = true"
      />
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
  grid-template-columns: 50px auto 60px 90px 130px 150px;
  background: var(--color-background-surface-accent);

  &_even {
    background: var(--color-background-surface);
  }

  &_short {
    .ReportTableRow_Description {
      -webkit-line-clamp: 1;
      .ReportTableRow_Tag {
        float: right;
        margin-left: 10px;
      }
    }
    .ReportTableRow_Column_type_actions {
      flex-direction: row;
    }
  }

  &_Description {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    width: 100%;
  }

  &_Tag {
    float: right;
    margin-left: 10px;
  }

  &_Column {
    padding: 8px;

    &_type {
      &_number {
        text-align: center;
        font-weight: 600;
      }

      &_description {
      }

      &_income {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
      }

      &_actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
      }
    }

    &_font_secondary {
      color: var(--color-text-placeholder);
    }
  }
}
</style>
