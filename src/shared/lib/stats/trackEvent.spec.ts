import { describe, expect, it } from 'vitest'
import { buildPrintBody, markEventDay } from './trackEvent'

const KEY = 'statsLastVisitDay'

const createStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

describe('markEventDay', () => {
  it('counts the first visit and remembers only the day', () => {
    const storage = createStorage()

    expect(markEventDay(storage, KEY, new Date('2026-11-25T10:00:00Z'))).toBe(true)
    expect([...storage.data.values()]).toEqual(['2026-11-25'])
  })

  it('skips repeated visits on the same UTC day', () => {
    const storage = createStorage()
    markEventDay(storage, KEY, new Date('2026-11-25T00:30:00Z'))

    expect(markEventDay(storage, KEY, new Date('2026-11-25T23:59:00Z'))).toBe(false)
  })

  it('keeps separate days for different events', () => {
    const storage = createStorage()
    const now = new Date('2026-11-25T10:00:00Z')
    markEventDay(storage, KEY, now)

    expect(markEventDay(storage, 'statsLastViewDay', now)).toBe(true)
  })

  it('counts again on the next UTC day', () => {
    const storage = createStorage()
    markEventDay(storage, KEY, new Date('2026-11-25T23:59:00Z'))

    expect(markEventDay(storage, KEY, new Date('2026-11-26T00:01:00Z'))).toBe(true)
  })

  it('does not count when storage is unavailable', () => {
    const storage = {
      getItem: () => {
        throw new Error('denied')
      },
      setItem: () => {},
    }

    expect(markEventDay(storage, KEY)).toBe(false)
  })
})

describe('buildPrintBody', () => {
  it('passes the report script and the interface locale', () => {
    const params = new URLSearchParams(buildPrintBody('srCyr', 'ru'))

    expect(params.get('script')).toBe('srCyr')
    expect(params.get('locale')).toBe('ru')
  })
})
