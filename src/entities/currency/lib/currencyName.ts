import { CURRENCY_FALLBACK_NAMES } from './currencyFallbackNames'

const displayNames = new Map<string, Intl.DisplayNames | null>()

function getDisplayNames(intlLocale: string): Intl.DisplayNames | null {
  if (!displayNames.has(intlLocale)) {
    try {
      displayNames.set(intlLocale, new Intl.DisplayNames([intlLocale], { type: 'currency', fallback: 'none' }))
    } catch {
      displayNames.set(intlLocale, null)
    }
  }
  return displayNames.get(intlLocale) ?? null
}

function getBrowserCurrencyName(code: string, intlLocale: string): string | undefined {
  try {
    return getDisplayNames(intlLocale)?.of(code) || undefined
  } catch {
    return undefined
  }
}

// Браузер в ru и sr отдаёт названия со строчной («евро»), а справочник — с заглавной: выравниваем.
function capitalize(text: string, intlLocale: string): string {
  return text.charAt(0).toLocaleUpperCase(intlLocale) + text.slice(1)
}

/**
 * Название валюты на языке интерфейса с заглавной буквы («Евро», «US Dollar»). Берётся из браузера
 * (Intl.DisplayNames), без запросов. Если браузер валюту не знает — из запасного словаря
 * (CURRENCY_FALLBACK_NAMES), а если нет и там — undefined.
 */
export function getCurrencyName(code: string, intlLocale: string): string | undefined {
  const normalizedCode = code.trim().toUpperCase()
  const browserName = getBrowserCurrencyName(normalizedCode, intlLocale)
  if (browserName) return capitalize(browserName, intlLocale)
  return CURRENCY_FALLBACK_NAMES[intlLocale]?.[normalizedCode]
}
