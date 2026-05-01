import { describe, expect, it } from 'vitest'
import { cloneReportState, getTableTotals, isReportState } from './lib'
import type { ReportState } from './types'

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
})
