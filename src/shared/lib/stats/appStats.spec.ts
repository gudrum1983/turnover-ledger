import { afterEach, describe, expect, it, vi } from 'vitest'
import { STATS_API_URL } from '@/shared/constants/app'
import { fetchAppStats } from './appStats'

const mockFetch = (ok: boolean, body: unknown) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok, status: ok ? 200 : 503, json: async () => body } as Response)

describe('fetchAppStats', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns stats from the worker', async () => {
    const stats = { conversions: 12, prints: 3, printsByScript: { srLat: 2, srCyr: 1 }, since: '2026-11-24' }
    const fetchMock = mockFetch(true, stats)

    await expect(fetchAppStats()).resolves.toEqual(stats)
    expect(fetchMock).toHaveBeenCalledWith(STATS_API_URL)
  })

  it('accepts empty stats before the first event', async () => {
    mockFetch(true, { conversions: 0, prints: 0, printsByScript: {}, since: null })

    await expect(fetchAppStats()).resolves.toMatchObject({ conversions: 0, since: null })
  })

  it('rejects an error response', async () => {
    mockFetch(false, { error: 'stats are unavailable' })

    await expect(fetchAppStats()).rejects.toThrow('stats: 503')
  })

  it.each([
    { conversions: '12', prints: 3, printsByScript: {}, since: null },
    { conversions: -1, prints: 3, printsByScript: {}, since: null },
    { conversions: 1, prints: 3, since: null },
    null,
  ])('rejects an unexpected response %j', async (body) => {
    mockFetch(true, body)

    await expect(fetchAppStats()).rejects.toThrow('stats: unexpected response')
  })
})
