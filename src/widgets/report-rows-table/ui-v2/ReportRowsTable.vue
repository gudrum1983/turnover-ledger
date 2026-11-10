<script setup lang="ts">
import { computed } from 'vue'
import { ReportTableRow, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
/*import { ButtonBase } from '@/shared/ui-v2/button-base'*/
/*import { IconAdd } from '@/shared/ui/icons'*/
import { IconAddCircle, IconTrash } from '@/shared/ui-v2/icons'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { LabelContainer } from '@/shared/ui-v2/label-container'
import { TagBase } from '@/shared/ui-v2/tag-base'

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

const { rows, locale, displayTotalRsd } = defineProps<Props>()

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

const sizeRow = computed<'short' | 'full'>({
  get: () => (isFullTable.value ? 'full' : 'short'),
  set: (value) => {
    isFullTable.value = value === 'full'
  },
})

const options = [
  {
    value: 'short',
    label: 'Краткий',
  },
  {
    value: 'full',
    label: 'Расширенный',
  },
]
</script>

<template>
  <div class="ReportRowsTable">
    <div class="ReportRowsTable_Fieldset">
      <!--      <div class="ReportRowsTable_Actions">

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
      </div>-->

      <div class="ReportRowManage_Actions" v-if="rows.length">
        <div class="ReportRowManage_Actions_left">
          <ButtonWithIcon :icon="IconAddCircle" variant="page" @click="emit('add')">
            {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
          </ButtonWithIcon>
          <ButtonWithIcon :icon="IconTrash" variant="danger" @click="emit('clear')">
            {{ t('ui.reportBuilderIncomeRecordsTable.clearYear') }}
          </ButtonWithIcon>
        </div>

        <LabelContainer ariaLabel="Вариант таблицы" v-model="sizeRow" :options="options" size="l" />
      </div>

      <div v-if="rows.length > 0">
        <div class="ReportRowsTable_Header u-typo-label-s">
          <div>{{ t('ui.reportBuilderIncomeRecordsTable.rowNumber') }}</div>
          <div>{{ t('ui.reportBuilderIncomeRecordsTable.date') }}</div>
          <div>{{ t('ui.reportBuilderIncomeRecordsTable.description') }}</div>
          <div>{{ t('ui.reportBuilderIncomeRecordsTable.currency') }}</div>
          <div>
            {{ t('ui.reportBuilderIncomeRecordsTable.income') }}
          </div>
          <div>{{ t('ui.reportBuilderIncomeRecordsTable.income') }} в RSD</div>
          <div></div>
        </div>
        <div class="ReportRowsTable_Rows">
          <ReportTableRow
            v-for="(row, index) in rows"
            :key="row.id"
            :index="index"
            :locale="locale"
            :row="row"
            :size="sizeRow"
            @edit="emit('edit', $event)"
            @copy="emit('copy', $event)"
            @remove="emit('remove', $event)"
          />
        </div>
        <div v-if="rows.length > 0" class="ReportRowsTable_Footer">
          <div class="ReportRowsTable_TotalRow">
            <div class="ReportRowsTable_TotalIncome u-typo-subtitle-l">
              <div class="ReportRowsTable_TotalCell Typo_BodyAccent">
                {{ t('ui.reportBuilderIncomeRecordsTable.total') }} : {{ displayTotalRsd }}
              </div>
              <TagBase label="RSD" variant="fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportRowManage_Actions {
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  padding-inline: 24px;
  width: 100%;
}

.ReportRowManage_Actions_left {
  display: flex;
  gap: 16px;
}

.ReportRowsTable_TotalIncome {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
}

.ReportRowsTable_Footer {
  background: #8ebfd099;
  padding: 16px 16px 24px;
  // Скругляем низ под радиус родительского PaperBlock (вне его — без скругления).
  border-radius: 0 0 var(--radius-paper-block-inner, 0) var(--radius-paper-block-inner, 0);
}

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
    grid-template-columns: 60px 120px auto 180px 180px 180px 144px;
    width: 100%;
    /*  border: 1px solid var(--color-border-table-cell);*/
    background: var(--neutral-200);
    border-bottom: 1px solid #a7afb1;
    min-height: 56px;

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
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
  }

  &_TotalRow {
    display: flex;
    width: 100%;
    border-top: none;
  }

  &_TotalCell {
    display: flex;
    align-items: center;
    justify-content: center;
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
</style>
