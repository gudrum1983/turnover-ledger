import { describe, expect, it } from 'vitest'
import type { ReportRow } from '@/entities/report-row/@x/report'
import {
  PAUSAL_ANNUAL_LIMIT_RSD_CENTS,
  PDV_ROLLING_LIMIT_RSD_CENTS,
  findRollingLimitExceedance,
  getYearLimitStatus,
} from './limits'

const MILLION = 1_000_000 * 100

const row = (date: string, rsdCents: number, id = date): ReportRow => ({
  id,
  date,
  description: '',
  currency: 'EUR',
  amounts: {
    goods: { rsdCents: 0 },
    services: { rsdCents },
  },
})

describe('getYearLimitStatus', () => {
  it('считает лимит паушала только по записям выбранного года', () => {
    const rows = [row('2024-12-31', 5 * MILLION), row('2025-01-10', 3 * MILLION), row('2025-06-01', 3 * MILLION)]

    expect(getYearLimitStatus(rows, 2024).isPausalLimitExceeded).toBe(false)
    expect(getYearLimitStatus(rows, 2025)).toMatchObject({
      annualTotalRsdCents: 6 * MILLION,
      isPausalLimitExceeded: false,
    })
  })

  it('лимит паушала превышен, если доход за год больше 6 млн', () => {
    const rows = [row('2025-01-10', PAUSAL_ANNUAL_LIMIT_RSD_CENTS), row('2025-02-10', 1)]

    expect(getYearLimitStatus(rows, 2025).isPausalLimitExceeded).toBe(true)
  })

  it('ровно 6 млн — не превышение', () => {
    expect(getYearLimitStatus([row('2025-01-10', PAUSAL_ANNUAL_LIMIT_RSD_CENTS)], 2025).isPausalLimitExceeded).toBe(
      false,
    )
  })

  it('игнорирует записи с некорректной датой', () => {
    expect(getYearLimitStatus([row('2025', 7 * MILLION), row('', 7 * MILLION)], 2025)).toMatchObject({
      annualTotalRsdCents: 0,
      isPausalLimitExceeded: false,
      pdvLimitExceedance: null,
    })
  })
})

describe('findRollingLimitExceedance', () => {
  it('учитывает доход прошлого года в 12-месячном окне', () => {
    const rows = [row('2024-09-01', 5 * MILLION), row('2025-03-01', 3 * MILLION + 1)]

    expect(findRollingLimitExceedance(rows, 2025)).toEqual({
      date: '2025-03-01',
      totalRsdCents: 8 * MILLION + 1,
    })
    // Превышение случилось в 2025 году, а не в 2024.
    expect(findRollingLimitExceedance(rows, 2024)).toBeNull()
  })

  it('запись ровно годичной давности уже не входит в окно', () => {
    const rows = [row('2024-03-01', 5 * MILLION), row('2025-03-01', 4 * MILLION)]

    expect(findRollingLimitExceedance(rows, 2025)).toBeNull()
  })

  it('запись на следующий день после годичной давности входит в окно', () => {
    const rows = [row('2024-03-02', 5 * MILLION), row('2025-03-01', 4 * MILLION)]

    expect(findRollingLimitExceedance(rows, 2025)?.date).toBe('2025-03-01')
  })

  it('возвращает первую дату превышения в году', () => {
    const rows = [row('2025-01-15', 4 * MILLION), row('2025-02-15', 4 * MILLION + 1), row('2025-03-15', 1 * MILLION)]

    expect(findRollingLimitExceedance(rows, 2025)).toEqual({
      date: '2025-02-15',
      totalRsdCents: 8 * MILLION + 1,
    })
  })

  it('суммирует записи с одной датой и не зависит от порядка строк', () => {
    const rows = [row('2025-05-01', 4 * MILLION, 'a'), row('2025-01-01', 1, 'b'), row('2025-05-01', 4 * MILLION, 'c')]

    expect(findRollingLimitExceedance(rows, 2025)).toEqual({
      date: '2025-05-01',
      totalRsdCents: 8 * MILLION + 1,
    })
  })

  it('ровно 8 млн — не превышение', () => {
    expect(findRollingLimitExceedance([row('2025-01-01', PDV_ROLLING_LIMIT_RSD_CENTS)], 2025)).toBeNull()
  })

  it('корректно обрабатывает 29 февраля', () => {
    const rows = [row('2024-02-29', 5 * MILLION), row('2025-02-28', 4 * MILLION)]

    // Окно для 28.02.2025 — с 29.02.2024 (строго после 28.02.2024), запись входит.
    expect(findRollingLimitExceedance(rows, 2025)?.date).toBe('2025-02-28')
    // Для 01.03.2025 окно начинается после «29.02.2024» — запись уже не входит.
    expect(
      findRollingLimitExceedance([row('2024-02-29', 5 * MILLION), row('2025-03-01', 4 * MILLION)], 2025),
    ).toBeNull()
  })

  it('превышение внутри года находится, даже если за весь год лимит не превышен по окну с начала', () => {
    // Доход за 2025 год — 9 млн, но окно 12 месяцев на 01.12.2025 уже не содержит записи 2024-11-01.
    const rows = [row('2024-11-01', 4 * MILLION), row('2025-06-01', 4 * MILLION + 1), row('2025-12-01', 5 * MILLION)]

    expect(findRollingLimitExceedance(rows, 2025)).toEqual({
      date: '2025-06-01',
      totalRsdCents: 8 * MILLION + 1,
    })
  })
})
