import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ReportRow } from '@/entities/report-row/@x/report'
import type { FooterField, HeaderField } from './fields'
import { FOOTER_FIELDS, HEADER_FIELDS } from './fields'
import { cloneReportState, isReportState } from './lib'
import { getYearLimitStatus } from './limits'
import type { ReportState } from './types'
import { REPORT_FIRST_YEAR } from '@/shared/constants/app'

const STORE_ID = 'report-store'

// Строка относится к году, если у неё корректная дата формата YYYY-MM-DD с этим годом.
const isRowInYear = (row: ReportRow, year: number) =>
  /^\d{4}-\d{2}-\d{2}$/.test(row.date) && Number(row.date.slice(0, 4)) === year

// Сортировка стабильная: записи с одной датой остаются в порядке добавления.
const sortByDate = (list: ReportRow[]) => [...list].sort((left, right) => left.date.localeCompare(right.date))

// Индекс, куда вставить запись, чтобы она встала после всех записей с той же или более ранней датой.
const getInsertIndexByDate = (list: ReportRow[], date: string) => {
  const index = list.findIndex((item) => item.date.localeCompare(date) > 0)
  return index === -1 ? list.length : index
}

const hasUnsortedRowsByDate = (list: ReportRow[]) => {
  for (let index = 1; index < list.length; index += 1) {
    const previousDate = list[index - 1]?.date ?? ''
    const currentDate = list[index]?.date ?? ''

    if (previousDate > currentDate) {
      return true
    }
  }

  return false
}

export const useReportStore = defineStore(STORE_ID, () => {
  const LOCAL_STORAGE_KEY = 'reportState'
  const ACTIVE_YEAR_STORAGE_KEY = 'reportActiveYear'

  const formData = reactive({
    header: {
      pib: '',
      taxpayer: '',
      companyName: '',
      address: '',
      taxNumber: '',
      activityCode: '',
    },
    footer: {
      preparedBy: '',
      responsiblePerson: '',
    },
  })
  const rows = ref<ReportRow[]>([])
  const activeYear = ref(new Date().getFullYear())
  const activeYearRows = computed(() => rows.value.filter((row) => isRowInYear(row, activeYear.value)))
  // Лимиты считаются по всем записям: скользящее окно PDV захватывает и прошлый год.
  const activeYearLimitStatus = computed(() => getYearLimitStatus(rows.value, activeYear.value))

  function setActiveYear(year: number) {
    activeYear.value = year
  }

  const yearSummaries = computed(() => {
    const currentYear = new Date().getFullYear()
    const counts = new Map<number, number>()
    // Список начинается с REPORT_FIRST_YEAR, а если есть записи раньше — с самой ранней из них.
    let earliestYear = Math.min(REPORT_FIRST_YEAR, currentYear)

    for (const row of rows.value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) continue
      const year = Number(row.date.slice(0, 4))
      if (year < 1 || year > currentYear) continue
      counts.set(year, (counts.get(year) ?? 0) + 1)
      earliestYear = Math.min(earliestYear, year)
    }

    return Array.from({ length: currentYear - earliestYear + 1 }, (_, index) => {
      const year = earliestYear + index
      return { year, count: counts.get(year) ?? 0 }
    })
  })

  // Поле с предупреждением (например, ПИБ из 8 цифр) всё равно заполнено: проверка реквизитов мягкая.
  const metaFieldsProgress = computed(() => {
    const values = [
      ...HEADER_FIELDS.map((key) => formData.header[key]),
      ...FOOTER_FIELDS.map((key) => formData.footer[key]),
    ]

    return {
      filled: values.filter((value) => value.trim().length > 0).length,
      total: values.length,
    }
  })

  // Валюты для избранного: из строк активного года, а пока в нём нет ни одной записи — из предыдущего.
  // Так в начале года избранное не пустое, а валюты, которыми давно не пользовались, не копятся из года в год.
  const usedCurrencyCodes = computed(() => {
    const unique = new Set<string>()
    const ordered: string[] = []

    const addCode = (code: string) => {
      const normalized = code.trim().toUpperCase()
      if (!normalized || unique.has(normalized)) return
      unique.add(normalized)
      ordered.push(normalized)
    }

    const sourceYear = activeYearRows.value.length > 0 ? activeYear.value : activeYear.value - 1

    for (const row of rows.value) {
      if (isRowInYear(row, sourceYear) && typeof row.currency === 'string') addCode(row.currency)
    }

    return ordered
  })

  const lastUsedCurrencyCode = computed(() => rows.value.at(-1)?.currency ?? 'EUR')
  const hasUnsortedRows = computed(() => hasUnsortedRowsByDate(rows.value))
  const hasUnsortedActiveYearRows = computed(() => hasUnsortedRowsByDate(activeYearRows.value))

  const hasRowsFromDifferentYears = computed(() => {
    const years = new Set<string>()

    for (const row of rows.value) {
      if (!row.date) continue
      years.add(row.date.slice(0, 4))

      if (years.size > 1) {
        return true
      }
    }

    return false
  })

  function exportState(): ReportState {
    return cloneReportState({
      meta: {
        header: { ...formData.header },
        footer: { ...formData.footer },
      },
      rows: rows.value,
    })
  }

  function replaceState(nextState: ReportState) {
    const snapshot = cloneReportState(nextState)

    for (const key of Object.keys(formData.header) as HeaderField[]) {
      formData.header[key] = snapshot.meta.header[key]
    }

    for (const key of Object.keys(formData.footer) as FooterField[]) {
      formData.footer[key] = snapshot.meta.footer[key]
    }

    rows.value = sortByDate(snapshot.rows)
  }

  function setHeaderValue(field: HeaderField, value: string) {
    formData.header[field] = value
  }

  function setFooterValue(field: FooterField, value: string) {
    formData.footer[field] = value
  }

  // Строки всегда хранятся по дате: новая запись встаёт после записей с той же датой.
  function addRow(row: ReportRow) {
    rows.value.splice(getInsertIndexByDate(rows.value, row.date), 0, row)
  }

  function updateRow(index: number, row: ReportRow) {
    if (index < 0 || index >= rows.value.length) return

    // Дата не изменилась — запись остаётся на месте.
    if (rows.value[index]!.date === row.date) {
      rows.value[index] = row
      return
    }

    // Дата изменилась — переставляем запись, как будто её добавили заново с новой датой.
    rows.value.splice(index, 1)
    addRow(row)
  }

  function updateRowById(id: string, row: ReportRow) {
    updateRow(
      rows.value.findIndex((item) => item.id === id),
      row,
    )
  }

  function getRow(index: number): ReportRow | null {
    if (index < 0 || index >= rows.value.length) return null
    return rows.value[index] ?? null
  }

  function getRowById(id: string): ReportRow | null {
    return rows.value.find((item) => item.id === id) ?? null
  }

  function removeRow(index: number) {
    if (index < 0 || index >= rows.value.length) return
    rows.value.splice(index, 1)
  }

  function removeRowById(id: string) {
    const index = rows.value.findIndex((item) => item.id === id)
    if (index === -1) return
    rows.value.splice(index, 1)
  }

  function setRows(nextRows: ReportRow[]) {
    rows.value = sortByDate(nextRows)
  }

  function clearRows() {
    rows.value = []
  }

  // Удаляет только строки активного года, записи других лет остаются.
  function clearActiveYearRows() {
    rows.value = rows.value.filter((row) => !isRowInYear(row, activeYear.value))
  }

  // Строки и так хранятся по дате; оставлено для v1 и для данных, изменённых в обход экшенов.
  function sortRowsByDate() {
    rows.value = sortByDate(rows.value)
  }

  function hydrateFromLocalStorage() {
    const savedYear = Number(localStorage.getItem(ACTIVE_YEAR_STORAGE_KEY))
    activeYear.value =
      Number.isInteger(savedYear) && savedYear >= 1 && savedYear <= 9999 ? savedYear : new Date().getFullYear()

    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as unknown

        if (isReportState(parsed)) {
          replaceState(parsed)
          return
        }

        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'meta' in parsed &&
          parsed.meta &&
          typeof parsed.meta === 'object' &&
          'header' in parsed.meta
        ) {
          for (const key of Object.keys(formData.header) as HeaderField[]) {
            const value = (parsed.meta as ReportState['meta']).header[key]
            if (typeof value === 'string') formData.header[key] = value
          }
        }

        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'meta' in parsed &&
          parsed.meta &&
          typeof parsed.meta === 'object' &&
          'footer' in parsed.meta
        ) {
          for (const key of Object.keys(formData.footer) as FooterField[]) {
            const value = (parsed.meta as ReportState['meta']).footer[key]
            if (typeof value === 'string') formData.footer[key] = value
          }
        }

        if (typeof parsed === 'object' && parsed !== null && 'rows' in parsed && Array.isArray(parsed.rows)) {
          rows.value = sortByDate(parsed.rows as ReportRow[])
        }

        return
      } catch {
        // ignore invalid data in localStorage
      }
    }
  }

  watch(activeYear, (year) => {
    localStorage.setItem(ACTIVE_YEAR_STORAGE_KEY, String(year))
  })

  watch(
    () => [formData, rows.value] as const,
    () => {
      const payload = exportState()
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
    },
    { deep: true },
  )

  return {
    formData,
    metaFieldsProgress,
    yearSummaries,
    activeYear,
    activeYearRows,
    activeYearLimitStatus,
    setActiveYear,
    rows,
    usedCurrencyCodes,
    lastUsedCurrencyCode,
    hasUnsortedRows,
    hasUnsortedActiveYearRows,
    hasRowsFromDifferentYears,
    exportState,
    replaceState,
    setHeaderValue,
    setFooterValue,
    addRow,
    updateRow,
    updateRowById,
    getRow,
    getRowById,
    removeRow,
    removeRowById,
    setRows,
    clearRows,
    clearActiveYearRows,
    sortRowsByDate,
    hydrateFromLocalStorage,
  }
})
