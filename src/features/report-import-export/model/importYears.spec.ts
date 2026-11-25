import { describe, expect, it } from 'vitest'
import { getImportYearItems } from './importYears'

describe('getImportYearItems', () => {
  it('lists only file years from newest to oldest, with counts in the book', () => {
    const current = [
      { year: 2026, count: 10, rsdCents: 100 },
      { year: 2025, count: 20, rsdCents: 200 },
      { year: 2023, count: 8, rsdCents: 80 },
    ]
    const file = [
      { year: 2024, count: 14, rsdCents: 1400 },
      { year: 2026, count: 16, rsdCents: 1600 },
      { year: 2025, count: 13, rsdCents: 1300 },
    ]

    expect(getImportYearItems(current, file)).toEqual([
      { year: 2026, current: 10, inFile: 16, rsdCents: 1600 },
      { year: 2025, current: 20, inFile: 13, rsdCents: 1300 },
      { year: 2024, current: 0, inFile: 14, rsdCents: 1400 },
    ])
  })
})
