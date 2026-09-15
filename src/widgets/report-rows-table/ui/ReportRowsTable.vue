<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ReportTableRow, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui/button-base'
import { DividerToggle } from '@/shared/ui/divider-toggle'
import { IconAdd, IconCompress, IconExpand } from '@/shared/ui/icons'
import { InfoHint } from '@/shared/ui/info-hint'

type Props = {
  rows: ReportRow[]
  locale: I18nLocale
  reportTitle: string
  displayTotalRsd: string
  displayTotalLimitRsd: string
  isTotalLimitExceeded: boolean
  hasUnsortedRows: boolean
  hasRowsFromDifferentYears: boolean
}

const { rows, locale, displayTotalRsd, isTotalLimitExceeded, hasUnsortedRows, hasRowsFromDifferentYears } =
  defineProps<Props>()

const emit = defineEmits<{
  (event: 'add'): void
  (event: 'sort'): void
  (event: 'clear'): void
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const { t } = useLocale()

const isFullTable = defineModel<boolean>('isFullTable', { required: true })

const sizeRow = computed(() => (isFullTable.value ? 'short' : 'full'))

const isMobileViewport = ref(false)
let mobileMediaQuery: MediaQueryList | null = null

const isMobile = computed(() => isMobileViewport.value)

function handleViewportChange(event: MediaQueryListEvent) {
  isMobileViewport.value = event.matches
}

onMounted(() => {
  mobileMediaQuery = window.matchMedia('(max-width: 768px)')
  isMobileViewport.value = mobileMediaQuery.matches
  mobileMediaQuery.addEventListener('change', handleViewportChange)
})

onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener('change', handleViewportChange)
})
</script>

<template>
  <div class="ReportRowsTable">
    <DividerToggle
      v-model="isFullTable"
      :label="t('ui.reportBuilderSections.incomeRecords')"
      :aria-expand-label="t('ui.accessibility.expandSection')"
      :aria-collapse-label="t('ui.accessibility.collapseSection')"
      color="disabled"
    >
      <template #icon-active><IconExpand style="width: 18px; height: 18px" /></template>
      <template #icon><IconCompress style="width: 18px; height: 18px" /></template>
    </DividerToggle>

    <div class="ReportRowsTable_Fieldset">
      <div class="ReportRowsTable_Actions">
        <div class="ReportRowsTable_RowActions">
          <ButtonBase color="primary" size="xs" @click="emit('add')">
            {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
          </ButtonBase>

          <ButtonBase v-if="rows.length > 0" color="danger" size="xs" @click="emit('clear')">
            {{ t('ui.reportBuilderIncomeRecordsTable.clearTable') }}
          </ButtonBase>
        </div>
        <div class="ReportRowsTable_Alerts">
          <div
            v-if="isTotalLimitExceeded"
            class="ReportRowsTable_Alert ReportRowsTable_Alert_Danger Typo_BodyAccent"
            role="alert"
          >
            {{ t('ui.tableAlerts.annualLimit.message') }}.
            <InfoHint :text="t('ui.tableAlerts.annualLimit.hint')" />
          </div>
          <div v-if="hasUnsortedRows" class="ReportRowsTable_Alert Typo_BodyAccent" role="alert">
            {{ t('ui.tableAlerts.sortByDate.message') }}.
            <InfoHint :text="t('ui.tableAlerts.sortByDate.hint')" />
          </div>
          <div v-if="hasRowsFromDifferentYears" class="ReportRowsTable_Alert Typo_BodyAccent" role="alert">
            {{ t('ui.tableAlerts.differentYears.message') }}.
            <InfoHint :text="t('ui.tableAlerts.differentYears.hint')" />
          </div>
          <ButtonBase v-if="rows.length > 0 && hasUnsortedRows" color="warning" size="xs" @click="emit('sort')">
            {{ t('ui.reportBuilderIncomeRecordsTable.sortByDate') }}
          </ButtonBase>
        </div>
      </div>
      <div>
        <div class="ReportRowsTable_Header">
          <div class="ReportRowsTable_TitleNumber">{{ t('ui.reportBuilderIncomeRecordsTable.rowNumber') }}</div>
          <div class="ReportRowsTable_TitleDescription">{{ t('ui.reportBuilderIncomeRecordsTable.description') }}</div>
          <div class="ReportRowsTable_TitleAmountsForeign">
            {{ t('ui.reportBuilderIncomeRecordsTable.income') }} {{ t('ui.reportBuilderIncomeRecordsTable.currency') }}
          </div>
          <div class="ReportRowsTable_TitleAmountsLocal">{{ t('ui.reportBuilderIncomeRecordsTable.income') }} RSD</div>
        </div>
        <div class="ReportRowsTable_Rows">
          <ReportTableRow
            v-for="(row, index) in rows"
            :key="row.id"
            :index="index"
            :locale="locale"
            :row="row"
            :size="sizeRow"
            :isMobile="isMobile"
            @edit="emit('edit', $event)"
            @copy="emit('copy', $event)"
            @remove="emit('remove', $event)"
          />
        </div>
        <div v-if="rows.length < 1" class="ReportRowsTable_Empty">
          {{ t('ui.reportBuilderIncomeRecordsTable.emptyHint') }}
          <ButtonBase
            color="primary"
            size="xs"
            variant="outlined"
            isIconOnly
            :aria-label="t('ui.reportBuilderIncomeRecordsTable.addRow')"
            @click="emit('add')"
          >
            <template #icon>
              <IconAdd style="width: 18px; height: 18px" />
            </template>
          </ButtonBase>
        </div>

        <div v-if="rows.length > 0" class="ReportRowsTable_TotalRow">
          <div></div>
          <div class="ReportRowsTable_TotalCell Typo_BodyAccent">
            {{ t('ui.reportBuilderIncomeRecordsTable.total') }}
          </div>
          <div class="ReportRowsTable_TotalCell Typo_BodyAccent">{{ displayTotalRsd }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportRowsTable {
  &_Fieldset {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 20px;
  }

  &_Actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
  }

  &_RowActions {
    display: flex;
    gap: 10px;
  }

  &_Header {
    display: grid;
    grid-template-areas: 'titleNumber titleDescription . titleForeignAmounts titleRsdAmounts';
    grid-template-columns: 50px auto 60px 90px 130px 150px;
    width: 100%;
    border: 1px solid var(--color-border-table-cell);
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    background: var(--color-background-default);

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
    }
  }

  &_Empty {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 10px;
    text-align: center;
    color: var(--color-text-disabled);
    border: 1px solid var(--color-border-table-cell);
    border-radius: 0 0 6px 6px;
    border-top: none;
  }

  &_Rows {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-table-cell);
  }

  &_TotalRow {
    display: grid;
    grid-template-columns: 50px auto 60px 90px 130px 140px;
    gap: 5px;
    width: 100%;
    border: 1px solid var(--color-border-table-cell);
    border-top: none;
    border-radius: 0 0 6px 6px;
    background: var(--color-background-default);
  }

  @media (max-width: 768px) {
    .ReportRowsTable_Header {
      grid-template-areas:
        'titleNumber titleDescription titleDescription titleDescription titleDescription'
        '. titleForeignAmounts titleForeignAmounts titleRsdAmounts titleRsdAmounts';
      grid-template-columns: 50px 1fr 1fr 1fr 1fr;
    }

    .ReportRowsTable_TotalRow {
      grid-template-columns: auto 130px 140px;
    }

    .ReportTableRow_Cell_type_actions {
      flex-direction: row;
    }
  }

  &_TotalCell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }

  &_Alerts {
    display: flex;
    gap: 10px;
  }

  &_Alert {
    color: var(--color-text-warning);
    text-align: center;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding-inline: 6px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--color-background-warning-hovered) 10%, transparent);
    border: 1px dashed var(--color-text-warning);
  }

  &_Alert_Danger {
    color: var(--color-text-danger);
    text-align: center;
    background: color-mix(in srgb, var(--color-background-danger-hovered) 10%, transparent);
    border: 1px dashed var(--color-text-danger);
  }
}

.ReportRowsTable_TitleAmountsForeign {
  justify-self: flex-end;
  grid-area: titleForeignAmounts;
}
.ReportRowsTable_TitleAmountsLocal {
  justify-self: flex-end;
  grid-area: titleRsdAmounts;
}
.ReportRowsTable_TitleDescription {
  grid-area: titleDescription;
}
.ReportRowsTable_TitleNumber {
  grid-area: titleNumber;
}
</style>
