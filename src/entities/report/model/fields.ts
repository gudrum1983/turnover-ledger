export const HEADER_FIELDS = ['pib', 'taxpayer', 'companyName', 'address', 'taxNumber', 'activityCode'] as const
export const FOOTER_FIELDS = ['preparedBy', 'responsiblePerson'] as const
export const TITLE_FIELDS = ['firstLine', 'secondLine'] as const
export const TABLE_FIELDS = [
  'rowNumber',
  'dateAndDescription',
  'income',
  'incomeFromProducts',
  'incomeFromServices',
  'totalIncome',
] as const

export type HeaderField = (typeof HEADER_FIELDS)[number]
export type FooterField = (typeof FOOTER_FIELDS)[number]
export type TitleField = (typeof TITLE_FIELDS)[number]
export type TableField = (typeof TABLE_FIELDS)[number]
