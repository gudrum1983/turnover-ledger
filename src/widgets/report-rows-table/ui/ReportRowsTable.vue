<script setup lang="ts">
import { computed } from 'vue'
import { ReportTableRow, type ReportRow } from '@/entities/report-row'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui/button-base'
import { DividerToggle } from '@/shared/ui/divider-toggle'
import { IconAdd, IconCompress, IconExpand } from '@/shared/ui/icons'

type Props = {
  rows: ReportRow[]
  locale: I18nLocale
  reportTitle: string
  dateAndDescriptionLabel: string
  displayTotalRsd: string
  displayTotalLimitRsd: string
  isTotalLimitExceeded: boolean
}

const {
  rows,
  locale,
  reportTitle,
  dateAndDescriptionLabel,
  displayTotalRsd,
  displayTotalLimitRsd,
  isTotalLimitExceeded,
} = defineProps<Props>()

const emit = defineEmits<{
  (event: 'add'): void
  (event: 'clear'): void
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const { t } = useLocale()

const isFullTable = defineModel<boolean>('isFullTable', { required: true })

const sizeRow = computed(() => (isFullTable.value ? 'short' : 'full'))
</script>

<template>
  <div class="ReportRowsTable">
    <DividerToggle
      v-model="isFullTable"
      :label="reportTitle"
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
          <ButtonBase color="primary" size="xs" @click="emit('add')">{{ t('ui.reportTable.addRow') }}</ButtonBase>
          <ButtonBase v-if="rows.length > 0" color="danger" size="xs" @click="emit('clear')">
            {{ t('ui.reportTable.clearTable') }}
          </ButtonBase>
        </div>
      </div>
      <div>
        <div class="ReportRowsTable_Header">
          <div>{{ t('ui.reportTable.rowNumber') }}</div>
          <div>{{ dateAndDescriptionLabel }}</div>
          <div></div>
          <div>{{ t('ui.reportTable.income') }}<br />{{ t('ui.reportTable.currency') }}</div>
          <div>{{ t('ui.reportTable.income') }}<br />RSD</div>
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
        <div v-if="rows.length < 1" class="ReportRowsTable_Empty">
          {{ t('ui.reportTable.emptyHint') }}
          <ButtonBase
            color="primary"
            size="xs"
            variant="outlined"
            isIconOnly
            :aria-label="t('ui.reportTable.addRow')"
            @click="emit('add')"
          >
            <template #icon>
              <IconAdd style="width: 18px; height: 18px" />
            </template>
          </ButtonBase>
        </div>

        <div
          v-if="rows.length > 0"
          class="ReportRowsTable_TotalRow"
          :class="{ ReportRowsTable_TotalRow_withWarning: isTotalLimitExceeded }"
        >
          <div></div>
          <div></div>
          <div></div>
          <div class="ReportRowsTable_TotalCell Typo_BodyAccent">{{ t('ui.reportTable.total') }}</div>
          <div class="ReportRowsTable_TotalCell Typo_BodyAccent">{{ displayTotalRsd }}</div>
          <div></div>
        </div>
        <div v-if="isTotalLimitExceeded" class="ReportRowsTable_Warning Typo_BodyAccent" role="alert">
          {{ t('ui.reportTable.totalLimitExceeded') }} {{ displayTotalLimitRsd }}.
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

    &_withWarning {
      border-radius: 0;
    }
  }

  &_TotalCell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }

  &_Warning {
    padding: 12px 14px;
    color: var(--color-text-danger);
    background: color-mix(in srgb, var(--color-background-danger) 10%, white);
    border: 1px solid var(--color-border-danger);
    border-top: none;
    border-radius: 0 0 6px 6px;
    text-align: center;
  }
}
</style>
