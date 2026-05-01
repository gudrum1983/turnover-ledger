import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  cloneReportState,
  createReportExportFile,
  getTableTotals,
  isReportExportFile,
  isReportState,
  parseImportedReportState,
} from './lib'
import { REPORT_EXPORT_VERSION, type ReportState } from './types'

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
