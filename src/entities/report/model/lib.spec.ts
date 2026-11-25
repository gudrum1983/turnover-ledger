import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  cloneReportState,
  createEmptyReportMeta,
  createReportExportFile,
  filterImportableRows,
  getReportYearCounts,
  getTableTotals,
  hasReportMeta,
  isReportExportFile,
  isRowDateAllowed,
  isReportState,
  mergeReportState,
  parseImportedReportState,
  pickReportState,
} from './lib'
import { REPORT_EXPORT_VERSION, type ReportState } from './types'
import { getRowTotals } from '@/entities/report-row/@x/report'

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
      date: '2026-04-01',
      description: 'Products invoice',
      currency: 'EUR',
      exchangeRate: 117.3,
      amounts: {
        goods: {
          foreignCents: 1000,
          rsdCents: 117300,
        },
        services: {
          foreignCents: 200,
          rsdCents: 23460,
        },
      },
    },
    {
      id: 'row-2',
      date: '2026-04-02',
      description: 'Services invoice',
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
  ],
}

const validReportFixture = JSON.parse(
  readFileSync(fileURLToPath(new URL('./__fixtures__/valid-report.json', import.meta.url)), 'utf-8'),
) as unknown

const invalidReportFixture = JSON.parse(
  readFileSync(fileURLToPath(new URL('./__fixtures__/invalid-report.json', import.meta.url)), 'utf-8'),
) as unknown

describe('report lib', () => {
  it('calculates totals across multiple rows', () => {
    expect(getTableTotals(reportState.rows)).toEqual({
      foreignCents: 1200,
      rsdCents: 152760,
    })
  })

  it('accepts a valid report state shape', () => {
    expect(isReportState(reportState)).toBe(true)
  })

  it('rejects an invalid report state shape', () => {
    expect(
      isReportState({
        ...reportState,
        meta: {
          ...reportState.meta,
          header: {
            ...reportState.meta.header,
            pib: 123456789,
          },
        },
      }),
    ).toBe(false)
  })

  it('recognizes a valid export file shape', () => {
    expect(isReportExportFile(validReportFixture)).toBe(true)
  })

  it('rejects an invalid export file shape', () => {
    expect(isReportExportFile(invalidReportFixture)).toBe(false)
  })

  it('creates a deep copy of nested report state data', () => {
    const clonedState = cloneReportState(reportState)
    const clonedFirstRow = clonedState.rows[0]
    const sourceFirstRow = reportState.rows[0]

    expect(clonedState).toEqual(reportState)
    expect(clonedState).not.toBe(reportState)
    expect(clonedState.meta).not.toBe(reportState.meta)
    expect(clonedState.meta.header).not.toBe(reportState.meta.header)
    expect(clonedState.meta.footer).not.toBe(reportState.meta.footer)
    expect(clonedState.rows).not.toBe(reportState.rows)
    expect(clonedFirstRow).toBeDefined()
    expect(sourceFirstRow).toBeDefined()
    expect(clonedFirstRow).not.toBe(sourceFirstRow)
    expect(clonedFirstRow?.amounts).not.toBe(sourceFirstRow?.amounts)
    expect(clonedFirstRow?.amounts.goods).not.toBe(sourceFirstRow?.amounts.goods)
    expect(clonedFirstRow?.amounts.services).not.toBe(sourceFirstRow?.amounts.services)
  })

  it('creates an export file with current version and cloned data', () => {
    const exportFile = createReportExportFile(reportState)

    expect(exportFile.version).toBe(REPORT_EXPORT_VERSION)
    expect(typeof exportFile.exportedAt).toBe('string')
    expect(exportFile.data).toEqual(reportState)
    expect(exportFile.data).not.toBe(reportState)
  })

  it('parses a raw report state and returns a cloned value', () => {
    const parsedState = parseImportedReportState(reportState)

    expect(parsedState).toEqual(reportState)
    expect(parsedState).not.toBe(reportState)
  })

  it('parses a valid exported report fixture', () => {
    const parsedState = parseImportedReportState(validReportFixture)

    expect(parsedState).not.toBeNull()
    expect(isReportState(parsedState)).toBe(true)
    expect(parsedState).toEqual((validReportFixture as { data: ReportState }).data)
    expect(parsedState).not.toBe((validReportFixture as { data: ReportState }).data)
  })

  it('returns null for an invalid imported report fixture', () => {
    expect(parseImportedReportState(invalidReportFixture)).toBeNull()
  })
})

describe('report year selection', () => {
  const row = (id: string, date: string) => ({ ...reportState.rows[0]!, id, date })
  const current: ReportState = {
    meta: reportState.meta,
    rows: [row('c-2024', '2024-03-01'), row('c-2025', '2025-03-01'), row('c-bad', 'bad-date')],
  }
  const incoming: ReportState = {
    meta: { ...createEmptyReportMeta(), header: { ...createEmptyReportMeta().header, pib: '111111111' } },
    rows: [row('i-2025', '2025-05-01'), row('i-2026-a', '2026-01-01'), row('i-2026-b', '2026-02-01')],
  }
  const ids = (state: ReportState) => state.rows.map(({ id }) => id)

  it('counts rows per year from newest to oldest, skipping invalid dates', () => {
    const rowRsdCents = getRowTotals(reportState.rows[0]!).rsdCents
    expect(getReportYearCounts(current.rows)).toEqual([
      { year: 2025, count: 1, rsdCents: rowRsdCents },
      { year: 2024, count: 1, rsdCents: rowRsdCents },
    ])
    expect(getReportYearCounts(incoming.rows)[0]).toEqual({ year: 2026, count: 2, rsdCents: rowRsdCents * 2 })
  })

  it('detects filled meta', () => {
    expect(hasReportMeta(createEmptyReportMeta())).toBe(false)
    expect(hasReportMeta(incoming.meta)).toBe(true)
  })

  it('picks selected years and empties meta when it is not selected', () => {
    const picked = pickReportState(current, { years: [2025], meta: false })

    expect(ids(picked)).toEqual(['c-2025'])
    expect(picked.meta).toEqual(createEmptyReportMeta())
    expect(ids(pickReportState(current, { years: 'all', meta: true }))).toEqual(ids(current))
  })

  it('keeps local years that are missing in the file when all file years are imported', () => {
    const merged = mergeReportState(current, incoming, { years: [2025, 2026], meta: false })

    expect(ids(merged)).toEqual(['c-2024', 'c-bad', 'i-2025', 'i-2026-a', 'i-2026-b'])
    expect(merged.meta).toEqual(current.meta)
  })

  it('replaces only selected years and keeps the others', () => {
    const merged = mergeReportState(current, incoming, { years: [2025], meta: true })

    expect(ids(merged)).toEqual(['c-2024', 'c-bad', 'i-2025'])
    expect(merged.meta).toEqual(incoming.meta)
  })

  it('adds a year that is missing locally', () => {
    expect(ids(mergeReportState(current, incoming, { years: [2026], meta: false }))).toEqual([
      'c-2024',
      'c-2025',
      'c-bad',
      'i-2026-a',
      'i-2026-b',
    ])
  })
})

describe('import date limits', () => {
  const today = new Date(2026, 10, 23)
  const row = (date: string) => ({ ...reportState.rows[0]!, id: date, date })

  it('allows dates from 2020-01-01 up to today', () => {
    expect(isRowDateAllowed(row('2020-01-01'), today)).toBe(true)
    expect(isRowDateAllowed(row('2026-11-23'), today)).toBe(true)
  })

  it('rejects dates before 2020, after today and invalid dates', () => {
    expect(isRowDateAllowed(row('2019-12-31'), today)).toBe(false)
    expect(isRowDateAllowed(row('2026-11-24'), today)).toBe(false)
    expect(isRowDateAllowed(row('2025-02-30'), today)).toBe(false)
    expect(isRowDateAllowed(row('bad-date'), today)).toBe(false)
  })

  it('keeps only importable rows and counts the skipped ones', () => {
    const state = { ...reportState, rows: [row('2016-05-01'), row('2025-05-01'), row('2026-12-15')] }
    const result = filterImportableRows(state, today)

    expect(result.state.rows.map(({ date }) => date)).toEqual(['2025-05-01'])
    expect(result.skippedCount).toBe(2)
  })
})
