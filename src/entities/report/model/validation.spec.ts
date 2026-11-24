import { describe, expect, it } from 'vitest'
import { getHeaderFieldWarning, getPersonNameWarning } from './validation'

describe('header field warnings', () => {
  it.each(['123456789', '1234567890123', '000000000'])('accepts PIB %s', (value) => {
    expect(getHeaderFieldWarning('pib', value)).toBeUndefined()
  })

  it.each(['', '12345678', '1234567890', '12345678901', '123456789012', '12345678901234', '12345678a', '123 456789'])(
    'rejects PIB %s',
    (value) => {
      expect(getHeaderFieldWarning('pib', value)).toBe('ui.reportBuilderMetaFields.validation.pib')
    },
  )

  it.each(['12345678', '1234567890123', '00000000'])('accepts registration number %s', (value) => {
    expect(getHeaderFieldWarning('taxNumber', value)).toBeUndefined()
  })

  it.each([
    '',
    '1234567',
    '123456789',
    '1234567890',
    '12345678901',
    '123456789012',
    '12345678901234',
    '1234567a',
    '1234 5678',
  ])('rejects registration number %s', (value) => {
    expect(getHeaderFieldWarning('taxNumber', value)).toBe('ui.reportBuilderMetaFields.validation.taxNumber')
  })

  it.each([
    ['companyName', 'Company'],
    ['activityCode', '62.01'],
    ['activityCode', 'abcd'],
  ] as const)('does not check %s', (field, value) => {
    expect(getHeaderFieldWarning(field, value)).toBeUndefined()
  })
})

describe('names', () => {
  it.each(['Ivan Markov', 'Ivan', 'Petar P. Petrović', 'Анна-Мария Иванова', "John O'Connor", 'Đorđe'])(
    'accepts %s',
    (value) => {
      expect(getPersonNameWarning(value)).toBeUndefined()
      expect(getHeaderFieldWarning('taxpayer', value)).toBeUndefined()
    },
  )

  it.each(['Ivan Markov2', '123456789', 'Petar 1 Petrović'])('warns about digits in %s', (value) => {
    expect(getPersonNameWarning(value)).toBe('ui.reportBuilderMetaFields.validation.personName')
    expect(getHeaderFieldWarning('taxpayer', value)).toBe('ui.reportBuilderMetaFields.validation.personName')
  })
})
