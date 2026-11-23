import { afterEach, describe, expect, it, vi } from 'vitest'
import { CURRENCY_FALLBACK_NAMES } from './currencyFallbackNames'
import { getCurrencyName } from './currencyName'

describe('getCurrencyName', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('берёт название из браузера, если он его знает', () => {
    vi.spyOn(Intl.DisplayNames.prototype, 'of').mockReturnValue('Euro (browser)')

    expect(getCurrencyName('eur', 'en')).toBe('Euro (browser)')
  })

  it('делает первую букву названия из браузера заглавной', () => {
    vi.spyOn(Intl.DisplayNames.prototype, 'of').mockReturnValue('евро')

    expect(getCurrencyName('EUR', 'ru')).toBe('Евро')
  })

  it('берёт название из запасного словаря, если браузер валюту не знает', () => {
    vi.spyOn(Intl.DisplayNames.prototype, 'of').mockReturnValue(undefined)

    expect(getCurrencyName(' dem ', 'sr-Latn')).toBe('Nemačka marka')
    expect(getCurrencyName('DEM', 'ru')).toBe('Немецкая марка')
  })

  it('возвращает undefined, если названия нет ни в браузере, ни в словаре', () => {
    vi.spyOn(Intl.DisplayNames.prototype, 'of').mockReturnValue(undefined)

    expect(getCurrencyName('ZZZ', 'en')).toBeUndefined()
  })
})

describe('CURRENCY_FALLBACK_NAMES', () => {
  it('все названия с заглавной буквы', () => {
    for (const [locale, names] of Object.entries(CURRENCY_FALLBACK_NAMES)) {
      for (const name of Object.values(names)) {
        expect(name.charAt(0)).toBe(name.charAt(0).toLocaleUpperCase(locale))
      }
    }
  })

  it('во всех локалях одинаковый набор валют', () => {
    const [first, ...rest] = Object.values(CURRENCY_FALLBACK_NAMES).map((names) => Object.keys(names).sort())

    for (const codes of rest) expect(codes).toEqual(first)
  })
})
