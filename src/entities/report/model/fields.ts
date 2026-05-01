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
    labelKey: 'ui.reportBuilderMetaFields.taxpayerInfo.pib.label',
    placeholderKey: 'ui.reportBuilderMetaFields.taxpayerInfo.pib.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.taxpayerInfo.pib.hint',
    isDigit: true,
  },
  {
    key: 'taxpayer',
    labelKey: 'ui.reportBuilderMetaFields.taxpayerInfo.taxpayer.label',
    placeholderKey: 'ui.reportBuilderMetaFields.taxpayerInfo.taxpayer.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.taxpayerInfo.taxpayer.hint',
    isDigit: false,
  },
  {
    key: 'companyName',
    labelKey: 'ui.reportBuilderMetaFields.taxpayerInfo.companyName.label',
    placeholderKey: 'ui.reportBuilderMetaFields.taxpayerInfo.companyName.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.taxpayerInfo.companyName.hint',
    isDigit: false,
  },
  {
    key: 'address',
    labelKey: 'ui.reportBuilderMetaFields.taxpayerInfo.address.label',
    placeholderKey: 'ui.reportBuilderMetaFields.taxpayerInfo.address.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.taxpayerInfo.address.hint',
    isDigit: false,
  },
  {
    key: 'taxNumber',
    labelKey: 'ui.reportBuilderMetaFields.taxpayerInfo.taxNumber.label',
    placeholderKey: 'ui.reportBuilderMetaFields.taxpayerInfo.taxNumber.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.taxpayerInfo.taxNumber.hint',
    isDigit: true,
  },
  {
    key: 'activityCode',
    labelKey: 'ui.reportBuilderMetaFields.taxpayerInfo.activityCode.label',
    placeholderKey: 'ui.reportBuilderMetaFields.taxpayerInfo.activityCode.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.taxpayerInfo.activityCode.hint',
    isDigit: false,
  },
] as const satisfies readonly ReportMetaFieldConfig<string>[]

export const FOOTER_META_FIELDS = [
  {
    key: 'preparedBy',
    labelKey: 'ui.reportBuilderMetaFields.responsiblePeople.preparedBy.label',
    placeholderKey: 'ui.reportBuilderMetaFields.responsiblePeople.preparedBy.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.responsiblePeople.preparedBy.hint',
    isDigit: false,
  },
  {
    key: 'responsiblePerson',
    labelKey: 'ui.reportBuilderMetaFields.responsiblePeople.responsiblePerson.label',
    placeholderKey: 'ui.reportBuilderMetaFields.responsiblePeople.responsiblePerson.placeholder',
    hintKey: 'ui.reportBuilderMetaFields.responsiblePeople.responsiblePerson.hint',
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
