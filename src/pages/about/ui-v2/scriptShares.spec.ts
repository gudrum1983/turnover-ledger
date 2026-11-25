import { describe, expect, it } from 'vitest'
import { getScriptShares } from './scriptShares'

describe('getScriptShares', () => {
  it('returns shares that always add up to 100', () => {
    expect(getScriptShares(20, 4)).toEqual({ cyrillic: 83, latin: 17 })
    expect(getScriptShares(1, 2)).toEqual({ cyrillic: 33, latin: 67 })
  })

  it('handles a single script', () => {
    expect(getScriptShares(0, 5)).toEqual({ cyrillic: 0, latin: 100 })
  })

  it('returns null before the first print with a known script', () => {
    expect(getScriptShares(0, 0)).toBeNull()
  })
})
