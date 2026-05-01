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

  it('detects unsorted rows by date', () => {
    const store = useReportStore()

    store.setRows(reportState.rows)

    expect(store.hasUnsortedRows).toBe(true)
  })

  it('detects rows from different years', () => {
    const store = useReportStore()

    store.setRows(reportState.rows)

    expect(store.hasRowsFromDifferentYears).toBe(true)
  })

  it('sorts rows by date ascending', () => {
    const store = useReportStore()

    store.setRows(reportState.rows)
    store.sortRowsByDate()

    expect(store.rows.map((row) => row.id)).toEqual(['row-3', 'row-2', 'row-1'])
    expect(store.hasUnsortedRows).toBe(false)
  })

  it('replaces and exports state without losing data', () => {
    const store = useReportStore()

    store.replaceState(reportState)

    const exportedState = store.exportState()

    expect(exportedState).toEqual(reportState)
    expect(exportedState).not.toBe(reportState)
    expect(exportedState.meta.header).not.toBe(reportState.meta.header)
    expect(exportedState.meta.footer).not.toBe(reportState.meta.footer)
    expect(exportedState.rows).not.toBe(reportState.rows)
    expect(exportedState.rows[0]).not.toBe(reportState.rows[0])
  })

  it('hydrates valid state from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(reportState))
    const store = useReportStore()

    store.hydrateFromLocalStorage()

    expect(store.exportState()).toEqual(reportState)
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
