import { describe, expect, it } from 'vitest'
import { getImportYearItems } from './importYears'

describe('getImportYearItems', () => {
  it('merges current and file years from newest to oldest', () => {
    const current = [
      { year: 2026, count: 10 },
      { year: 2025, count: 20 },
      { year: 2023, count: 8 },
    ]
    const file = [
      { year: 2026, count: 16 },
      { year: 2025, count: 13 },
      { year: 2024, count: 14 },
    ]

    expect(getImportYearItems(current, file)).toEqual([
      { year: 2026, current: 10, inFile: 16 },
      { year: 2025, current: 20, inFile: 13 },
      { year: 2024, current: 0, inFile: 14 },
      { year: 2023, current: 8, inFile: 0 },
    ])
  })
})
