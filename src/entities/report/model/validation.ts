import type { I18nMessageKey } from '@/shared/i18n'
import type { HeaderField } from './fields'

export function getPersonNameError(value: string): I18nMessageKey | undefined {
  const words = value.trim().split(/[ \u00a0]+/)
  const namePart = /^\p{L}[\p{L}\p{M}]*(?:[-'’ʼ]\p{L}[\p{L}\p{M}]*)*$/u
  if (words.length < 2 || words.some((word) => !namePart.test(word))) {
    return 'ui.reportBuilderMetaFields.validation.personName'
  }
  return undefined
}

export function getHeaderFieldError(field: HeaderField, value: string): I18nMessageKey | undefined {
  if (field === 'taxpayer') return getPersonNameError(value)
  if (field === 'pib' && !/^(?:[0-9]{9}|[0-9]{13})$/.test(value)) {
    return 'ui.reportBuilderMetaFields.validation.pib'
  }
  if (field === 'taxNumber' && !/^(?:[0-9]{8}|[0-9]{13})$/.test(value)) {
    return 'ui.reportBuilderMetaFields.validation.taxNumber'
  }
  if (field === 'activityCode' && !/[0-9]{4}/.test(value)) {
    return 'ui.reportBuilderMetaFields.validation.activityCode'
  }
  return undefined
}
