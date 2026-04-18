import type { I18nMessageKey } from '@/shared/i18n'

type ReportMetaFieldConfig<Key extends string> = {
  key: Key
  labelKey: I18nMessageKey
  placeholderKey: I18nMessageKey
  hintKey: I18nMessageKey
  isDigit: boolean
}

export const HEADER_META_FIELDS = [
  {
    key: 'pib',
    labelKey: 'ui.reportMetaFields.header.pib.label',
    placeholderKey: 'ui.reportMetaFields.header.pib.placeholder',
    hintKey: 'ui.reportMetaFields.header.pib.hint',
    isDigit: true,
  },
  {
    key: 'taxpayer',
    labelKey: 'ui.reportMetaFields.header.taxpayer.label',
    placeholderKey: 'ui.reportMetaFields.header.taxpayer.placeholder',
    hintKey: 'ui.reportMetaFields.header.taxpayer.hint',
    isDigit: false,
  },
  {
    key: 'companyName',
    labelKey: 'ui.reportMetaFields.header.companyName.label',
    placeholderKey: 'ui.reportMetaFields.header.companyName.placeholder',
    hintKey: 'ui.reportMetaFields.header.companyName.hint',
    isDigit: false,
  },
  {
    key: 'address',
    labelKey: 'ui.reportMetaFields.header.address.label',
    placeholderKey: 'ui.reportMetaFields.header.address.placeholder',
    hintKey: 'ui.reportMetaFields.header.address.hint',
    isDigit: false,
  },
  {
    key: 'taxNumber',
    labelKey: 'ui.reportMetaFields.header.taxNumber.label',
    placeholderKey: 'ui.reportMetaFields.header.taxNumber.placeholder',
    hintKey: 'ui.reportMetaFields.header.taxNumber.hint',
    isDigit: true,
  },
  {
    key: 'activityCode',
    labelKey: 'ui.reportMetaFields.header.activityCode.label',
    placeholderKey: 'ui.reportMetaFields.header.activityCode.placeholder',
    hintKey: 'ui.reportMetaFields.header.activityCode.hint',
    isDigit: false,
  },
] as const satisfies readonly ReportMetaFieldConfig<string>[]

export const FOOTER_META_FIELDS = [
  {
    key: 'preparedBy',
    labelKey: 'ui.reportMetaFields.footer.preparedBy.label',
    placeholderKey: 'ui.reportMetaFields.footer.preparedBy.placeholder',
    hintKey: 'ui.reportMetaFields.footer.preparedBy.hint',
    isDigit: false,
  },
  {
    key: 'responsiblePerson',
    labelKey: 'ui.reportMetaFields.footer.responsiblePerson.label',
    placeholderKey: 'ui.reportMetaFields.footer.responsiblePerson.placeholder',
    hintKey: 'ui.reportMetaFields.footer.responsiblePerson.hint',
    isDigit: false,
  },
] as const satisfies readonly ReportMetaFieldConfig<string>[]

export type HeaderField = (typeof HEADER_META_FIELDS)[number]['key']
export type FooterField = (typeof FOOTER_META_FIELDS)[number]['key']
export type HeaderMetaField = (typeof HEADER_META_FIELDS)[number]
export type FooterMetaField = (typeof FOOTER_META_FIELDS)[number]

export const HEADER_FIELDS: HeaderField[] = HEADER_META_FIELDS.map(({ key }) => key)
export const FOOTER_FIELDS: FooterField[] = FOOTER_META_FIELDS.map(({ key }) => key)

export const TITLE_FIELDS = ['firstLine', 'secondLine'] as const
export const TABLE_FIELDS = [
  'rowNumber',
  'dateAndDescription',
  'income',
  'incomeFromProducts',
  'incomeFromServices',
  'totalIncome',
] as const

export type TitleField = (typeof TITLE_FIELDS)[number]
export type TableField = (typeof TABLE_FIELDS)[number]
