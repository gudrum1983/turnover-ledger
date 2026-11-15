<script setup lang="ts">
import type { ReportRow } from '@/entities/report-row'
import type { Viewport } from '@/shared/lib'
import ReportRowsTableDesktop from './ReportRowsTableDesktop.vue'
import ReportRowsTableTablet from './ReportRowsTableTablet.vue'
import ReportRowsTableMobile from './ReportRowsTableMobile.vue'
import type { I18nLocale } from '@/shared/i18n'
import { useLocale } from '@/shared/i18n'
import { TagBase } from '@/shared/ui-v2/tag-base'
import { IconInfoCircle } from '@/shared/ui-v2/icons'
import { TooltipWrapper } from '@/shared/ui-v2/tooltip-wrapper'
import type { ReportRowsTableAlert } from './types'

type Props = {
  rows: ReportRow[]
  /** Текущий вьюпорт: по нему выбирается вид таблицы (desktop / tablet / mobile) */
  viewport: Viewport
  /** Вид строк десктопной таблицы: краткий или расширенный */
  sizeRow: 'short' | 'full'
  locale: I18nLocale
  reportTitle: string
  displayTotalRsd: string
  /** Предупреждения о лимитах выбранного года, выводятся над итогом */
  limitAlerts?: ReportRowsTableAlert[]
  hasUnsortedRows: boolean
  hasRowsFromDifferentYears: boolean
  /** id строки, которую нужно подсветить (новая или переместившаяся после смены даты) */
  highlightedRowId?: string | null
}

const { rows, locale, displayTotalRsd, limitAlerts = [], highlightedRowId = null } = defineProps<Props>()

const emit = defineEmits<{
  (event: 'add'): void
  (event: 'sort'): void
  (event: 'clear'): void
  (event: 'edit', id: string): void
  (event: 'copy', id: string): void
  (event: 'remove', id: string): void
}>()

const { t } = useLocale()
</script>

<template>
  <div class="ReportRowsTable">
    <div class="ReportRowsTable_Fieldset">
      <!--      <div class="ReportRowManage_Actions" v-if="rows.length">
        <div class="ReportRowManage_Actions_left" v-if="viewport === 'desktop'">
          <ButtonWithIcon :icon="IconAddCircle" variant="page" @click="emit('add')">
            {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
          </ButtonWithIcon>
          <ButtonWithIcon :icon="IconTrash" variant="danger" @click="emit('clear')">
            {{ t('ui.reportBuilderIncomeRecordsTable.clearYear') }}
          </ButtonWithIcon>
        </div>

        <div class="ReportRowManage_Actions_left" v-if="viewport === 'tablet'">
          <ButtonWithIcon :icon="IconAddCircle" variant="page" @click="emit('add')">
            {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
          </ButtonWithIcon>
          <ButtonWithIcon :icon="IconTrash" variant="danger" @click="emit('clear')">
            {{ t('ui.reportBuilderIncomeRecordsTable.clearYear') }}
          </ButtonWithIcon>
        </div>

        <div class="ReportRowManage_Actions_left" v-else>
          <ButtonIcon ariaLabel="Добавить строку" size="l" type="button" variant="page" @click="emit('add')">
            <IconAddCircle size="m" />
          </ButtonIcon>

          <ButtonIcon ariaLabel="Очистить год" size="l" type="button" variant="page" @click="emit('clear')">
            <IconTrash size="m" />
          </ButtonIcon>
        </div>

        <LabelContainer
          v-if="viewport === 'desktop'"
          ariaLabel="Вариант таблицы"
          v-model="sizeRow"
          :options="options"
          size="l"
        />
      </div>-->

      <div v-if="rows.length > 0">
        <ReportRowsTableDesktop
          v-if="viewport === 'desktop'"
          :rows="rows"
          :locale="locale"
          :highlighted-row-id="highlightedRowId"
          :size="sizeRow"
          @edit="emit('edit', $event)"
          @copy="emit('copy', $event)"
          @remove="emit('remove', $event)"
        />
        <ReportRowsTableTablet
          v-else-if="viewport === 'tablet'"
          :rows="rows"
          :locale="locale"
          :highlighted-row-id="highlightedRowId"
          @edit="emit('edit', $event)"
          @copy="emit('copy', $event)"
          @remove="emit('remove', $event)"
        />
        <ReportRowsTableMobile
          v-else
          :rows="rows"
          :locale="locale"
          :highlighted-row-id="highlightedRowId"
          @edit="emit('edit', $event)"
          @copy="emit('copy', $event)"
          @remove="emit('remove', $event)"
        />
        <div
          v-if="rows.length > 0"
          class="ReportRowsTable_Footer"
          :class="[`ReportRowsTable_Footer_${viewport}`, { ReportRowsTable_Footer_error: limitAlerts.length > 0 }]"
        >
          <ul v-if="limitAlerts.length" class="ReportRowsTable-Alerts">
            <li v-for="alert in limitAlerts" :key="alert.id" class="ReportRowsTable-LimitAlert" role="alert">
              <TooltipWrapper v-if="alert.details" :text="alert.details" :error-text="alert.error" :max-width="240">
                <!-- tabindex — чтобы подсказку можно было открыть с клавиатуры -->
                <span
                  class="ReportRowsTable-LimitAlertIcon"
                  tabindex="0"
                  :aria-label="[alert.error, alert.details].filter(Boolean).join('. ')"
                >
                  <IconInfoCircle size="s" />
                </span>
              </TooltipWrapper>
              <span class="u-typo-label-s">{{ alert.message }}</span>
              <div class="ReportRowManage_AlertDivider" v-if="viewport === 'desktop'" />
            </li>
          </ul>
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
  display: flex;
  gap: 8px;
  align-items: center;
}

.ReportRowsTable-Alerts {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  /*  align-content: center;*/
}

.ReportRowsTable-LimitAlert {
  display: flex;
  gap: 4px;
  align-items: center;
}

.ReportRowsTable-LimitAlertIcon {
  display: inline-flex;
  cursor: help;
  border-radius: 50%;
  color: var(--red-500);

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}

.ReportRowsTable_Footer {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  background: #8ebfd099;
  padding: 16px 16px 24px;
  // Скругляем низ под радиус родительского PaperBlock (вне его — без скругления).
  border-radius: 0 0 var(--radius-paper-block-inner, 0) var(--radius-paper-block-inner, 0);
}

// Футер с предупреждениями о превышении лимитов.
.ReportRowsTable_Footer_error {
  background: var(--red-300);
}

// Модификаторы футера по вьюпорту.
/*.ReportRowsTable_Footer_desktop {
}*/

.ReportRowsTable_Footer_tablet {
  justify-content: space-between;
  .ReportRowsTable-Alerts {
    flex-direction: column;
    gap: 16px;
  }
}

.ReportRowsTable_Footer_mobile {
  flex-direction: column-reverse;
  .ReportRowsTable-Alerts {
    flex-direction: column;
    gap: 16px;
  }
  .ReportRowsTable_TotalRow {
    justify-content: flex-end;
  }
}

.ReportRowManage_AlertDivider {
  width: 2px;
  height: 26px;
  opacity: 1;
  border-radius: 2px;
  background: var(--red-200);
  margin-inline: 16px;
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

  &_TotalRow {
    display: flex;
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
