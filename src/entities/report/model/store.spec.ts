import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useReportStore } from './store'
import type { ReportState } from './types'

type LocalStorageMock = {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
  removeItem: ReturnType<typeof vi.fn>
  clear: ReturnType<typeof vi.fn>
}

const reportState: ReportState = {
  meta: {
    header: {
      pib: '123456789',
      taxpayer: 'Test Taxpayer',
      companyName: 'Test Company',
      address: 'Belgrade',
      taxNumber: '987654321',
      activityCode: '6201',
    },
    footer: {
      preparedBy: 'Prepared By',
      responsiblePerson: 'Responsible Person',
    },
  },
  rows: [
    {
      id: 'row-1',
      date: '2026-04-10',
      description: 'Invoice 10',
      currency: ' eur ',
      exchangeRate: 117.3,
      amounts: {
        goods: {
          foreignCents: 1000,
          rsdCents: 117300,
        },
        services: {
          foreignCents: 0,
          rsdCents: 0,
        },
      },
    },
    {
      id: 'row-2',
      date: '2026-03-01',
      description: 'Invoice 03',
      currency: 'RSD',
      amounts: {
        goods: {
          foreignCents: null,
          rsdCents: 5000,
        },
        services: {
          foreignCents: undefined,
          rsdCents: 7000,
        },
      },
    },
    {
      id: 'row-3',
      date: '2025-12-20',
      description: 'Invoice 12',
      currency: 'EUR',
      exchangeRate: 117.5,
      amounts: {
        goods: {
          foreignCents: 2500,
          rsdCents: 293750,
        },
        services: {
          foreignCents: 500,
          rsdCents: 58750,
        },
      },
    },
  ],
}

// reportState.rows по дате: row-3 (2025-12-20), row-2 (2026-03-01), row-1 (2026-04-10).
const sortedReportState: ReportState = {
  ...reportState,
  rows: [reportState.rows[2]!, reportState.rows[1]!, reportState.rows[0]!],
}

const makeRow = (id: string, date: string) => ({ ...reportState.rows[0]!, id, date })

function createLocalStorageMock(): LocalStorageMock {
  return {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
}

describe('report store', () => {
  let localStorageMock: LocalStorageMock

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock = createLocalStorageMock()
    vi.stubGlobal('localStorage', localStorageMock)
  })

  it('collects unique currency codes in insertion order', () => {
    const store = useReportStore()

    store.setRows(reportState.rows)

    expect(store.usedCurrencyCodes).toEqual(['EUR', 'RSD'])
  })

  it('defaults the active year to the current year', () => {
    expect(useReportStore().activeYear).toBe(new Date().getFullYear())
  })

  it('restores the active year independently of report data', () => {
    localStorageMock.getItem.mockImplementation((key: string) => (key === 'reportActiveYear' ? '2025' : null))
    const store = useReportStore()

    store.hydrateFromLocalStorage()

    expect(store.activeYear).toBe(2025)
  })

  it.each([null, '', 'invalid', '0', '2025.5', '10000'])('uses the current year for saved value %s', (savedYear) => {
    localStorageMock.getItem.mockReturnValue(savedYear)
    const store = useReportStore()
    store.setActiveYear(2024)

    store.hydrateFromLocalStorage()

    expect(store.activeYear).toBe(new Date().getFullYear())
  })

  it('persists changes to the active year', async () => {
    const store = useReportStore()

    store.setActiveYear(2025)
    await Promise.resolve()

    expect(localStorageMock.setItem).toHaveBeenCalledWith('reportActiveYear', '2025')
  })

  it('selects rows for the active year and reacts to row changes', () => {
    const store = useReportStore()
    store.setRows([...reportState.rows])

    store.setActiveYear(2025)
    expect(store.activeYear).toBe(2025)
    expect(store.activeYearRows.map((row) => row.id)).toEqual(['row-3'])

    store.setActiveYear(2026)
    expect(store.activeYearRows.map((row) => row.id)).toEqual(['row-2', 'row-1'])

    store.removeRowById('row-1')
    expect(store.activeYearRows.map((row) => row.id)).toEqual(['row-2'])

    store.setActiveYear(2024)
    expect(store.activeYearRows).toEqual([])
    expect(store.rows).toHaveLength(2)
  })

  it('clears only rows of the active year', () => {
    const store = useReportStore()
    store.setRows([...reportState.rows])

    store.setActiveYear(2026)
    store.clearActiveYearRows()

    expect(store.activeYearRows).toEqual([])
    expect(store.rows.map((row) => row.id)).toEqual(['row-3'])
  })

  it('detects unsorted rows within the active year', () => {
    const store = useReportStore()
    // Экшены всегда сортируют, поэтому неотсортированные строки кладём напрямую.
    store.rows = [...reportState.rows]

    store.setActiveYear(2026)
    expect(store.hasUnsortedActiveYearRows).toBe(true)

    store.setActiveYear(2025)
    expect(store.hasUnsortedActiveYearRows).toBe(false)
  })

  it('lists years from REPORT_FIRST_YEAR to the current year', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-10'))
    const store = useReportStore()
    store.setRows([...reportState.rows])

    expect(store.yearSummaries.map((item) => item.year)).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026])
    expect(store.yearSummaries.find((item) => item.year === 2026)?.count).toBe(2)
    expect(store.yearSummaries.find((item) => item.year === 2020)?.count).toBe(0)
    vi.useRealTimers()
  })

  it('extends the year list back to the earliest row before REPORT_FIRST_YEAR', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-10'))
    const store = useReportStore()
    store.setRows([{ ...reportState.rows[0]!, id: 'old', date: '2018-05-01' }])

    expect(store.yearSummaries[0]).toEqual({ year: 2018, count: 1 })
    expect(store.yearSummaries.at(-1)?.year).toBe(2026)
    vi.useRealTimers()
  })

  it('detects unsorted rows by date', () => {
    const store = useReportStore()

    store.rows = [...reportState.rows]

    expect(store.hasUnsortedRows).toBe(true)
  })

  it('detects rows from different years', () => {
    const store = useReportStore()

    store.setRows(reportState.rows)

    expect(store.hasRowsFromDifferentYears).toBe(true)
  })

  it('sorts rows by date ascending', () => {
    const store = useReportStore()

    store.rows = [...reportState.rows]
    store.sortRowsByDate()

    expect(store.rows.map((row) => row.id)).toEqual(['row-3', 'row-2', 'row-1'])
    expect(store.hasUnsortedRows).toBe(false)
  })

  describe('автоматическая сортировка по дате', () => {
    it('setRows сортирует строки, одинаковые даты остаются в исходном порядке', () => {
      const store = useReportStore()

      store.setRows([makeRow('b', '2026-02-01'), makeRow('a1', '2026-01-01'), makeRow('a2', '2026-01-01')])

      expect(store.rows.map((row) => row.id)).toEqual(['a1', 'a2', 'b'])
      expect(store.hasUnsortedRows).toBe(false)
    })

    it('addRow вставляет запись по дате после записей с той же датой', () => {
      const store = useReportStore()
      store.setRows([makeRow('jan', '2026-01-10'), makeRow('mar', '2026-03-10')])

      store.addRow(makeRow('feb', '2026-02-10'))
      store.addRow(makeRow('jan-2', '2026-01-10'))
      store.addRow(makeRow('apr', '2026-04-10'))
      store.addRow(makeRow('dec', '2025-12-31'))

      expect(store.rows.map((row) => row.id)).toEqual(['dec', 'jan', 'jan-2', 'feb', 'mar', 'apr'])
    })

    it('updateRowById без смены даты оставляет запись на месте', () => {
      const store = useReportStore()
      store.setRows([makeRow('a', '2026-01-10'), makeRow('b', '2026-01-10'), makeRow('c', '2026-01-10')])

      store.updateRowById('a', { ...makeRow('a', '2026-01-10'), description: 'changed' })

      expect(store.rows.map((row) => row.id)).toEqual(['a', 'b', 'c'])
      expect(store.rows[0]?.description).toBe('changed')
    })

    it('updateRowById со сменой даты переставляет запись в конец своей новой даты', () => {
      const store = useReportStore()
      store.setRows([makeRow('a', '2026-01-10'), makeRow('b', '2026-02-10'), makeRow('c', '2026-03-10')])

      store.updateRowById('c', makeRow('c', '2026-01-10'))
      expect(store.rows.map((row) => row.id)).toEqual(['a', 'c', 'b'])

      store.updateRowById('a', makeRow('a', '2026-04-01'))
      expect(store.rows.map((row) => row.id)).toEqual(['c', 'b', 'a'])
    })

    it('updateRowById игнорирует неизвестный id', () => {
      const store = useReportStore()
      store.setRows([makeRow('a', '2026-01-10')])

      store.updateRowById('missing', makeRow('missing', '2026-01-01'))

      expect(store.rows.map((row) => row.id)).toEqual(['a'])
    })
  })

  it('replaces and exports state without losing data', () => {
    const store = useReportStore()

    store.replaceState(reportState)

    const exportedState = store.exportState()

    // Состояние сохраняется полностью, строки — в порядке дат.
    expect(exportedState).toEqual(sortedReportState)
    expect(exportedState).not.toBe(reportState)
    expect(exportedState.meta.header).not.toBe(reportState.meta.header)
    expect(exportedState.meta.footer).not.toBe(reportState.meta.footer)
    expect(exportedState.rows).not.toBe(reportState.rows)
    expect(exportedState.rows[0]).not.toBe(sortedReportState.rows[0])
  })

  it('hydrates valid state from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(reportState))
    const store = useReportStore()

    store.hydrateFromLocalStorage()

    expect(store.exportState()).toEqual(sortedReportState)
  })

  it('does not throw on invalid localStorage json', () => {
    localStorageMock.getItem.mockReturnValue('{invalid json')
    const store = useReportStore()

    expect(() => store.hydrateFromLocalStorage()).not.toThrow()
    expect(store.rows).toEqual([])
  })

  it('writes updated state back to localStorage', async () => {
    const store = useReportStore()

    store.setHeaderValue('pib', '123456789')
    store.addRow(reportState.rows[0]!)

    await Promise.resolve()

    expect(localStorageMock.setItem).toHaveBeenCalled()
    expect(localStorageMock.setItem).toHaveBeenLastCalledWith('reportState', JSON.stringify(store.exportState()))
  })
})
