import { describe, expect, it } from 'vitest'
import { createSlavicPluralRule } from './pluralRules'

describe('createSlavicPluralRule', () => {
  it.each([
    ['ru', 1, 0],
    ['ru', 21, 0],
    ['ru', 2, 1],
    ['ru', 24, 1],
    ['ru', 0, 2],
    ['ru', 5, 2],
    ['ru', 11, 2],
    ['ru', 12, 2],
    ['ru', 111, 2],
    ['sr', 1, 0],
    ['sr', 3, 1],
    ['sr', 13, 2],
    ['sr', 25, 2],
  ])('%s: %i → форма %i', (locale, count, expected) => {
    expect(createSlavicPluralRule(locale)(count, 3)).toBe(expected)
  })

  it('не выходит за число форм в сообщении', () => {
    expect(createSlavicPluralRule('ru')(5, 2)).toBe(1)
  })
})
