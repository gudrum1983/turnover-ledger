import { describe, expect, it } from 'vitest'
import { getRowTotals } from './lib'
import type { ReportRow } from './types'

describe('report row lib', () => {
  it('sums goods and services amounts', () => {
    const row: ReportRow = {
      id: 'row-1',
      date: '2026-05-01',
      description: 'Consulting invoice',
      currency: 'EUR',
      exchangeRate: 117.4,
      amounts: {
        goods: {
          foreignCents: 1250,
          rsdCents: 146750,
        },
        services: {
          foreignCents: 3750,
          rsdCents: 440250,
        },
      },
    }

    expect(getRowTotals(row)).toEqual({
      foreignCents: 5000,
      rsdCents: 587000,
    })
  })

  it('treats undefined and null foreign amounts as zero', () => {
    const row: ReportRow = {
      id: 'row-2',
      date: '2026-05-02',
      description: 'Mixed revenue',
      currency: 'RSD',
      amounts: {
        goods: {
          foreignCents: undefined,
          rsdCents: 1000,
        },
        services: {
          foreignCents: null,
          rsdCents: 2000,
        },
      },
    }

    expect(getRowTotals(row)).toEqual({
      foreignCents: 0,
      rsdCents: 3000,
    })
  })
})
