<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { type ReportRow, ROW_HIGHLIGHT_DURATION_MS } from '@/entities/report-row'
import {
  type ReportRowEditModalMode,
  type ReportRowFormInitialValue,
  type ReportRowPayload,
  ReportRowEditModal,
} from '@/features/report-row-edit'
import { getTableTotals, useReportStore } from '@/entities/report'
import { formatDateForUi, formatMoney, useViewport } from '@/shared/lib'
import { useLocale, useLocaleStore } from '@/shared/i18n'
import { DialogConfirm } from '@/shared/ui-v2/dialog-confirm'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { IconAddCircle, IconTrash } from '@/shared/ui-v2/icons'
import { LabelContainer } from '@/shared/ui-v2/label-container'
import { FadeTransition } from '@/shared/ui-v2/fade-transition'
import { ReportYearSelect } from '@/features/report-year-select'
import { ReportRowsTable, type ReportRowsTableAlert } from '@/widgets/report-rows-table'

const store = useReportStore()
// Конструктор работает с записями выбранного года: таблица, итог, лимит и очистка.
const { activeYearRows: rows, activeYear, activeYearLimitStatus, hasUnsortedActiveYearRows } = storeToRefs(store)

const localeStore = useLocaleStore()
const { t } = useLocale()

// Вид таблицы (полная / краткая) запоминаем между сессиями. По умолчанию — краткая.
const TABLE_VIEW_STORAGE_KEY = 'reportRowsTableView'
const isFullTable = ref(false)

try {
  isFullTable.value = localStorage.getItem(TABLE_VIEW_STORAGE_KEY) === 'full'
} catch {
  // localStorage недоступен — остаёмся на краткой таблице.
}

watch(isFullTable, (isFull) => {
  try {
    localStorage.setItem(TABLE_VIEW_STORAGE_KEY, isFull ? 'full' : 'short')
  } catch {
    // localStorage недоступен — переключение работает без сохранения.
  }
})
const tableTotals = computed(() => getTableTotals(rows.value))
const displayTotalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: localeStore.currentLocale }))

// Предупреждения о лимитах выбранного года: годовой лимит паушала и скользящий 12-месячный лимит PDV.
const limitAlerts = computed<ReportRowsTableAlert[]>(() => {
  const { isPausalLimitExceeded, pdvLimitExceedance } = activeYearLimitStatus.value
  const locale = localeStore.currentLocale
  const alerts: ReportRowsTableAlert[] = []

  if (isPausalLimitExceeded) {
    alerts.push({
      id: 'pausal-limit',
      message: t('ui.tableAlerts.pausalLimit.message'),
      // Оборот за год не повторяем — он уже есть в «Итого» под таблицей.
      details: t('ui.tableAlerts.pausalLimit.description'),
    })
  }

  if (pdvLimitExceedance) {
    alerts.push({
      id: 'pdv-limit',
      message: t('ui.tableAlerts.pdvLimit.message'),
      details: t('ui.tableAlerts.pdvLimit.description'),
      error: t('ui.tableAlerts.pdvLimit.details', {
        date: formatDateForUi(pdvLimitExceedance.date),
        amount: formatMoney(pdvLimitExceedance.totalRsdCents, { locale }),
      }),
    })
  }

  return alerts
})

const clearYearMessage = computed(() => {
  const count = rows.value.length
  return t('ui.deleteYearRowsModal.summary', { count, amount: displayTotalRsd.value }, count)
})

const open = ref(false)
const formMode = ref<ReportRowEditModalMode>('create')
const editingRowId = ref<string | null>(null)
const formInitialValue = ref<ReportRowFormInitialValue | null>(null)
const openDialogConfirm = ref(false)

const fromCents = (value: number | null | undefined) => (typeof value === 'number' ? value / 100 : null)

const mapRowToInitialValue = (row: ReportRow): ReportRowFormInitialValue => ({
  date: row.date,
  currency: row.currency,
  description: row.description,
  goodsAmount: fromCents(row.amounts.goods.foreignCents),
  servicesAmount: fromCents(row.amounts.services.foreignCents),
  goodsAmountRsd: fromCents(row.amounts.goods.rsdCents),
  servicesAmountRsd: fromCents(row.amounts.services.rsdCents),
  totalAmountRsd: fromCents(row.amounts.goods.rsdCents + row.amounts.services.rsdCents),
  exchangeRate: row.exchangeRate ?? null,
})

function openCreateModal(initialValue: ReportRowFormInitialValue | null = null) {
  formMode.value = 'create'
  editingRowId.value = null
  formInitialValue.value = initialValue
  open.value = true
}

function openEditModal(rowId: string) {
  const row = store.getRowById(rowId)
  if (!row) return

  formMode.value = 'edit'
  editingRowId.value = row.id
  formInitialValue.value = mapRowToInitialValue(row)
  open.value = true
}

function handleCopy(id: string) {
  const row = store.getRowById(id)
  if (!row) return
  openCreateModal(mapRowToInitialValue(row))
}

function handleRemove(id: string) {
  store.removeRowById(id)
}

function closeModal() {
  open.value = false
}

function closeDialogConfirm() {
  openDialogConfirm.value = false
}

function handleClearTable() {
  store.clearActiveYearRows()
  closeDialogConfirm()
}

function handleSortRows() {
  store.sortRowsByDate()
}

// Подсветка новой строки или строки, у которой сменилась дата (она могла переместиться в таблице).
const highlightedRowId = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

async function highlightRow(id: string) {
  clearTimeout(highlightTimer)
  // Сбрасываем и ставим заново, чтобы анимация перезапустилась, если подсвечиваем ту же строку повторно.
  highlightedRowId.value = null
  await nextTick()
  highlightedRowId.value = id
  highlightTimer = setTimeout(() => {
    highlightedRowId.value = null
  }, ROW_HIGHLIGHT_DURATION_MS)
}

onBeforeUnmount(() => clearTimeout(highlightTimer))

// Липкие кнопки над таблицей. Шапке колонок нужна их высота — передаём переменной --report-table-sticky-top.
// Прилипшее состояние ловим нулевым маркером перед кнопками: он ушёл за верх окна — кнопки прилипли.
const stickySentinel = useTemplateRef<HTMLElement>('stickySentinel')
const actionsRef = useTemplateRef<HTMLElement>('actionsRef')
const actionsHeight = ref(0)
const isActionsStuck = ref(false)

const stickyObserver =
  typeof IntersectionObserver === 'undefined'
    ? undefined
    : new IntersectionObserver(([entry]) => {
        isActionsStuck.value = Boolean(entry && !entry.isIntersecting && entry.boundingClientRect.top < 0)
      })
const actionsResizeObserver =
  typeof ResizeObserver === 'undefined'
    ? undefined
    : new ResizeObserver(([entry]) => {
        actionsHeight.value = entry?.borderBoxSize[0]?.blockSize ?? 0
      })

// Кнопок нет, пока в году нет записей, — подписываемся, когда элементы появляются.
watch(stickySentinel, (element, previous) => {
  if (previous) stickyObserver?.unobserve(previous)
  if (element) stickyObserver?.observe(element)
  else isActionsStuck.value = false
})
watch(actionsRef, (element, previous) => {
  if (previous) actionsResizeObserver?.unobserve(previous)
  if (element) actionsResizeObserver?.observe(element)
})

// В прилипшей полосе добавляется выбор года и места мало — подписи кнопок короче.
// Полное название остаётся в aria-label, чтобы «Очистить» без уточнения не было двусмысленным.
const addRowLabel = computed(() =>
  t(
    isActionsStuck.value
      ? 'ui.reportBuilderIncomeRecordsTable.addRowShort'
      : 'ui.reportBuilderIncomeRecordsTable.addRow',
  ),
)
const clearYearLabel = computed(() =>
  t(
    isActionsStuck.value
      ? 'ui.reportBuilderIncomeRecordsTable.clearYearShort'
      : 'ui.reportBuilderIncomeRecordsTable.clearYear',
  ),
)

onBeforeUnmount(() => {
  stickyObserver?.disconnect()
  actionsResizeObserver?.disconnect()
})

const toCents = (value: number) => Math.round(value * 100)

const createRowId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function onSubmit(payload: ReportRowPayload) {
  if (!payload.currency || !payload.date) return
  if (payload.goodsAmountRsd === null || payload.servicesAmountRsd === null) return

  const rowId = formMode.value === 'edit' && editingRowId.value ? editingRowId.value : createRowId()
  const row: ReportRow = {
    id: rowId,
    date: payload.date,
    description: payload.description,
    currency: payload.currency.toUpperCase(),
    exchangeRate: payload.exchangeRate,
    amounts: {
      goods: {
        foreignCents: toCents(payload.goodsAmount),
        rsdCents: toCents(payload.goodsAmountRsd),
      },
      services: {
        foreignCents: toCents(payload.servicesAmount),
        rsdCents: toCents(payload.servicesAmountRsd),
      },
    },
  }

  if (formMode.value === 'edit') {
    const isDateChanged = store.getRowById(row.id)?.date !== row.date
    store.updateRowById(row.id, row)
    if (isDateChanged) highlightRow(row.id)
  } else {
    store.addRow(row)
    highlightRow(row.id)
  }

  closeModal()
}

// На планшете и мобилке свои виды таблицы, переключатель «Краткий / Расширенный» там не показываем.
const viewport = useViewport()

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

const isShowYearSelect = computed(() => {
  const isMobaile = viewport.value === 'mobile'
  const isntEmpty = Boolean(rows.value.length)

  if (isMobaile) {
    return !isntEmpty
  } else {
    return true
  }
})
</script>

<template>
  <div
    class="ReportRowManage"
    :class="{ ReportRowManage_stuck: isActionsStuck }"
    :style="{ '--report-table-sticky-top': `${actionsHeight}px` }"
  >
    <div class="ReportRowManage-Header">
      <h2 class="ReportRowManage-Title u-typo-h2-l">
        {{ t('ui.reportBuilderSections.incomeRecords') }}
      </h2>

      <ReportYearSelect size="middle" typography="button-l" placement="center" v-if="isShowYearSelect" />

      <div v-if="rows.length < 1" class="ReportRowManage-Empty">
        <span class="u-typo-subtitle-l">{{
          t('ui.reportBuilderIncomeRecordsTable.emptyTitle', { year: activeYear })
        }}</span>
        <span class="ReportRowManage-EmptySubtitle u-typo-body-m">
          {{ t('ui.reportBuilderIncomeRecordsTable.emptySubtitle') }}
        </span>
        <ButtonWithIcon :icon="IconAddCircle" variant="accent" @click="openCreateModal()">
          {{ t('ui.reportBuilderIncomeRecordsTable.addRow') }}
        </ButtonWithIcon>
      </div>
    </div>

    <!-- Маркер прилипания: ушёл за верх окна — кнопки (и шапка таблицы) прилипли. -->
    <div v-if="rows.length" ref="stickySentinel" class="ReportRowManage-StickySentinel" aria-hidden="true" />
    <!-- Кнопки липнут у верха окна до конца таблицы (вместе с «Итого»); шапка колонок липнет под ними. -->
    <div
      v-if="rows.length"
      ref="actionsRef"
      class="ReportRowManage_Actions"
      :class="{ ReportRowManage_Actions_stuck: isActionsStuck }"
    >
      <div class="ReportRowManage_Actions_left" v-if="viewport === 'desktop'">
        <ButtonWithIcon
          :icon="IconAddCircle"
          variant="page"
          :aria-label="t('ui.reportBuilderIncomeRecordsTable.addRow')"
          @click="openCreateModal()"
        >
          {{ addRowLabel }}
        </ButtonWithIcon>
        <ButtonWithIcon
          :icon="IconTrash"
          variant="danger"
          :aria-label="t('ui.reportBuilderIncomeRecordsTable.clearYear')"
          @click="openDialogConfirm = true"
        >
          {{ clearYearLabel }}
        </ButtonWithIcon>
      </div>

      <div class="ReportRowManage_Actions_left" v-else-if="viewport === 'tablet'">
        <ButtonWithIcon
          :icon="IconAddCircle"
          variant="page"
          :aria-label="t('ui.reportBuilderIncomeRecordsTable.addRow')"
          @click="openCreateModal()"
        >
          {{ addRowLabel }}
        </ButtonWithIcon>
        <ButtonWithIcon
          :icon="IconTrash"
          variant="danger"
          :aria-label="t('ui.reportBuilderIncomeRecordsTable.clearYear')"
          @click="openDialogConfirm = true"
        >
          {{ clearYearLabel }}
        </ButtonWithIcon>
      </div>

      <!-- В прилипшей полосе на десктопе и планшете — ещё выбор года (макет): заголовок с выбором года
           уехал вверх. До прилипания не показываем, чтобы не дублировать выбор под заголовком. -->
      <FadeTransition v-if="viewport !== 'mobile'">
        <ReportYearSelect
          v-if="isActionsStuck"
          class="ReportRowManage-StickyYearSelect"
          size="middle"
          typography="button-l"
          placement="center"
        />
      </FadeTransition>

      <div class="ReportRowManage_Actions_mobile" v-else>
        <ButtonWithIcon
          :icon="IconAddCircle"
          variant="page"
          :aria-label="t('ui.reportBuilderIncomeRecordsTable.addRow')"
          @click="openCreateModal()"
        />
        <ReportYearSelect size="middle" typography="button-l" placement="center" />
        <ButtonWithIcon
          :icon="IconTrash"
          variant="danger"
          :aria-label="t('ui.reportBuilderIncomeRecordsTable.clearYear')"
          @click="openDialogConfirm = true"
        />
      </div>

      <LabelContainer
        v-if="viewport === 'desktop'"
        class="ReportRowManage-TableView"
        ariaLabel="Вариант таблицы"
        v-model="sizeRow"
        :options="options"
        size="l"
      />
    </div>

    <ReportRowsTable
      v-if="rows.length"
      :viewport="viewport"
      :size-row="sizeRow"
      :rows="rows"
      :locale="localeStore.currentLocale"
      :report-title="t('ui.reportBuilderSections.incomeRecords')"
      :display-total-rsd="displayTotalRsd"
      :limit-alerts="limitAlerts"
      :has-unsorted-rows="hasUnsortedActiveYearRows"
      :has-rows-from-different-years="false"
      :highlighted-row-id="highlightedRowId"
      @add="openCreateModal()"
      @sort="handleSortRows"
      @clear="openDialogConfirm = true"
      @edit="openEditModal"
      @copy="handleCopy"
      @remove="handleRemove"
    />

    <ReportRowEditModal v-model:open="open" :mode="formMode" :initial-value="formInitialValue" @submit="onSubmit" />

    <DialogConfirm
      v-model:open="openDialogConfirm"
      :title="t('ui.deleteYearRowsModal.title', { year: activeYear })"
      :message="clearYearMessage"
      :details="t('ui.deleteYearRowsModal.description')"
      :labelPrimaryButton="t('ui.deleteYearRowsModal.confirm')"
      :labelSecondaryButton="t('ui.deleteYearRowsModal.cancel')"
      type="delete"
      @confirm="handleClearTable"
    />
  </div>
</template>

<style scoped lang="scss">
.ReportRowManage {
  padding-top: 32px;

  &-Header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-Title {
    margin-bottom: 8px;
  }

  &-Empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-block: 40px 32px;
  }

  &-EmptySubtitle {
    padding-block: 4px 24px;
    color: var(--neutral-600);
  }
}

.ReportRowManage-StickySentinel {
  height: 0;
  // Отступ над кнопками — у маркера, а не у кнопок: маркер должен стоять вплотную к ним,
  // иначе «прилипло» включится раньше, чем кнопки дойдут до верха окна.
  margin-top: 24px;

  // На мобильном до кнопок меньше места, как было раньше (8px вместо 40px).
  &:has(+ .ReportRowManage_Actions .ReportRowManage_Actions_mobile) {
    margin-top: -8px;
  }
}

// Липкие кнопки над таблицей (макеты «Главный экран»): белая полоса во всю ширину карточки.
// Отступ сверху — padding (виден и в прилипшем состоянии, 16px от края окна), остальное — margin.
// Снизу 16px до шапки колонок — тоже внутри полосы, чтобы прилипшая шапка не вплотную к кнопкам.
.ReportRowManage_Actions {
  position: sticky;
  top: 0;
  // Выше липкой шапки колонок (z-index: 2) и содержимого строк.
  z-index: 3;
  display: flex;
  width: 100%;
  padding: 16px;
  // Нижние 16px полосы заходят на верхний отступ таблицы (20px): расстояние до шапки колонок не меняется.
  margin-bottom: -16px;
  justify-content: space-between;
  align-items: flex-end;
  background: var(--white);
  transition: box-shadow var(--transition-color);
}

.ReportRowManage_Actions_left {
  display: flex;
  gap: 24px;
}

// Десктоп: кнопки слева, выбор года по центру (в прилипшей полосе), вид таблицы справа — как в макете.
.ReportRowManage_Actions:has(.ReportRowManage-TableView) {
  .ReportRowManage_Actions_left {
    grid-column: 1;
    justify-self: start;
  }

  .ReportRowManage-StickyYearSelect {
    grid-column: 2;
  }

  .ReportRowManage-TableView {
    grid-column: 3;
    justify-self: end;
  }
}

.ReportRowManage_Actions_mobile {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 16px;
}

// В прилипшей полосе появляется выбор года — расстояние между группами 24px.
.ReportRowManage_Actions_stuck {
  gap: 24px;
}

// Тень под прилипшими кнопками — только на мобильном: там нет шапки колонок.
// На десктопе и планшете тень у шапки колонок (ReportRowsTableHeader).
.ReportRowManage_Actions_stuck:has(.ReportRowManage_Actions_mobile) {
  box-shadow: var(--shadow-sticky);
}

// Шапка колонок берёт тень прилипшего состояния из переменной (наследуется вниз по дереву).
.ReportRowManage_stuck {
  --report-table-header-shadow: var(--shadow-sticky);
}
</style>
