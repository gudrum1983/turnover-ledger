import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ReportRow } from '@/entities/report-row'
import type { FooterField, HeaderField } from './fields'
import { cloneReportState, isReportState } from './lib'
import type { ReportState } from './types'

const STORE_ID = 'report-store'

export const useReportStore = defineStore(STORE_ID, () => {
  const LOCAL_STORAGE_KEY = 'reportState'

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

  const usedCurrencyCodes = computed(() => {
    const unique = new Set<string>()
    const ordered: string[] = []

    const addCode = (code: string) => {
      const normalized = code.trim().toUpperCase()
      if (!normalized || unique.has(normalized)) return
      unique.add(normalized)
      ordered.push(normalized)
    }

    for (const row of rows.value) {
      if (typeof row.currency === 'string') addCode(row.currency)
    }

    return ordered
  })

  const lastUsedCurrencyCode = computed(() => rows.value.at(-1)?.currency ?? 'EUR')
  const hasUnsortedRows = computed(() => {
    for (let index = 1; index < rows.value.length; index += 1) {
      const previousDate = rows.value[index - 1]?.date ?? ''
      const currentDate = rows.value[index]?.date ?? ''

      if (previousDate > currentDate) {
        return true
      }
    }

    return false
  })

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

    rows.value = snapshot.rows
  }

  function setHeaderValue(field: HeaderField, value: string) {
    formData.header[field] = value
  }

  function setFooterValue(field: FooterField, value: string) {
    formData.footer[field] = value
  }

  function addRow(row: ReportRow) {
    rows.value.push(row)
  }

  function updateRow(index: number, row: ReportRow) {
    if (index < 0 || index >= rows.value.length) return
    rows.value[index] = row
  }

  function updateRowById(id: string, row: ReportRow) {
    const index = rows.value.findIndex((item) => item.id === id)
    if (index === -1) return
    rows.value[index] = row
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
    rows.value = nextRows
  }

  function clearRows() {
    rows.value = []
  }

  function sortRowsByDate() {
    rows.value = [...rows.value].sort((left, right) => left.date.localeCompare(right.date))
  }

  function hydrateFromLocalStorage() {
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
          rows.value = parsed.rows as ReportRow[]
        }

        return
      } catch {
        // ignore invalid data in localStorage
      }
    }
  }

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
    rows,
    usedCurrencyCodes,
    lastUsedCurrencyCode,
    hasUnsortedRows,
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
    sortRowsByDate,
    hydrateFromLocalStorage,
  }
})
