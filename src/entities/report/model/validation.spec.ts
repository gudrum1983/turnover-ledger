import { describe, expect, it } from 'vitest'
import { getHeaderFieldError, getPersonNameError } from './validation'

describe('header field validation', () => {
  it.each(['123456789', '1234567890123', '000000000'])('accepts PIB %s', (value) => {
    expect(getHeaderFieldError('pib', value)).toBeUndefined()
  })

  it.each(['', '12345678', '1234567890', '12345678901', '123456789012', '12345678901234', '12345678a', '123 456789'])(
    'rejects PIB %s',
    (value) => {
      expect(getHeaderFieldError('pib', value)).toBe('ui.reportBuilderMetaFields.validation.pib')
    },
  )

  it.each(['12345678', '1234567890123', '00000000'])('accepts registration number %s', (value) => {
    expect(getHeaderFieldError('taxNumber', value)).toBeUndefined()
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
    expect(getHeaderFieldError('taxNumber', value)).toBe('ui.reportBuilderMetaFields.validation.taxNumber')
  })

  it.each(['6201', '0010', '6201 - Рачунарско програмирање', '6201 - IT', ' 6201', '62010', 'Шифра: 6201'])(
    'accepts activity code %s',
    (value) => {
      expect(getHeaderFieldError('activityCode', value)).toBeUndefined()
    },
  )

  it.each(['', '620', 'abcd', '620 - IT', '62 01', '6a201', '123 - деятельность 456'])(
    'rejects activity code %s',
    (value) => {
      expect(getHeaderFieldError('activityCode', value)).toBe('ui.reportBuilderMetaFields.validation.activityCode')
    },
  )

  it('does not add restrictions to other fields', () => {
    expect(getHeaderFieldError('companyName', 'Company')).toBeUndefined()
  })
})

describe('person name validation', () => {
  it.each([
    'Ivan Markov',
    'Иван Марков',
    'Đorđe Petrović',
    'Анна-Мария Иванова',
    "John O'Connor",
    'John O’Connor',
    '  Ivan   Markov  ',
    'Иван Иванович Марков',
    'Jose\u0301 Garci\u0301a',
  ])('accepts %s', (value) => {
    expect(getPersonNameError(value)).toBeUndefined()
    expect(getHeaderFieldError('taxpayer', value)).toBeUndefined()
  })

  it.each([
    '',
    '   ',
    'Ivan',
    'Ivan Markov2',
    'Иван @Марков',
    'Ivan M.',
    '-Ivan Markov',
    'Ivan Markov-',
    'Ivan --Markov',
    'Ivan\nMarkov',
  ])('rejects %s', (value) => {
    expect(getPersonNameError(value)).toBe('ui.reportBuilderMetaFields.validation.personName')
    expect(getHeaderFieldError('taxpayer', value)).toBe('ui.reportBuilderMetaFields.validation.personName')
  })
})
