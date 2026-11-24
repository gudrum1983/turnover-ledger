import { describe, expect, it } from 'vitest'
import { formatMoneyInput, groupMoneyInput, normalizeMoneyInput, parseMoneyInput } from './moneyInput'

const NBSP = ' '

describe('normalizeMoneyInput', () => {
  it.each([
    ['ru-RU', `1${NBSP}200,50`, '1200,50'],
    ['ru-RU', '1 234 567,89', '1234567,89'],
    ['ru-RU', '1200.5', '1200,5'],
    ['en-US', '1,200.50', '1200.50'],
    ['en-US', '1200,5', '1200.5'],
    ['sr-RS', '1.200,50', '1200,50'],
    ['sr-RS', '1.234.567,89', '1234567,89'],
    ['sr-RS', '1200.5', '1200,5'],
  ])('%s: %s → %s', (locale, value, expected) => {
    expect(normalizeMoneyInput(value, locale)).toBe(expected)
  })

  // При наборе «.» и «,» — разделитель дробной части, а не разряды: лишние знаки отбросит маска.
  it.each([
    ['sr-RS', '1.200', '1,200'],
    ['sr-RS', '12,5,', '12,5,'],
    ['en-US', '1,20', '1.20'],
  ])('%s: при наборе %s → %s', (locale, value, expected) => {
    expect(normalizeMoneyInput(value, locale)).toBe(expected)
  })
})

describe('parseMoneyInput', () => {
  it.each([
    ['ru-RU', `1${NBSP}200,50`, 1200.5],
    ['ru-RU', '1200,5', 1200.5],
    ['en-US', '1,200.50', 1200.5],
    ['en-US', '1200.5', 1200.5],
    ['sr-RS', '1.200,50', 1200.5],
    ['sr-RS', '1.234.567,89', 1234567.89],
    ['sr-RS', '0,05', 0.05],
    ['sr-RS', '12,', 12],
  ])('%s: %s → %d', (locale, value, expected) => {
    expect(parseMoneyInput(value, locale)).toBe(expected)
  })

  it.each([null, undefined, '', 'abc'])('%s → 0', (value) => {
    expect(parseMoneyInput(value, 'ru-RU')).toBe(0)
  })
})

describe('formatMoneyInput', () => {
  it.each([
    ['ru-RU', 1200.5, `1${NBSP}200,50`],
    ['en-US', 1200.5, '1,200.50'],
    ['sr-RS', 1200.5, '1.200,50'],
    ['sr-RS', 0.5, '0,50'],
  ])('%s: %d → %s', (locale, value, expected) => {
    expect(formatMoneyInput(value, locale)).toBe(expected)
  })

  it.each(['ru-RU', 'en-US', 'sr-RS'])('%s: разбирается обратно в то же число', (locale) => {
    expect(parseMoneyInput(formatMoneyInput(1234567.89, locale), locale)).toBe(1234567.89)
  })
})

describe('groupMoneyInput', () => {
  it.each([
    ['ru-RU', '1200,5', `1${NBSP}200,5`],
    ['en-US', '1234567.', '1,234,567.'],
    ['sr-RS', '1200', '1.200'],
    ['sr-RS', '12', '12'],
    ['sr-RS', '', ''],
  ])('%s: %s → %s', (locale, value, expected) => {
    expect(groupMoneyInput(value, locale)).toBe(expected)
  })
})
