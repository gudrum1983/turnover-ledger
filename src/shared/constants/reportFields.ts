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

/*todo - Интересная конструкция с [number] - Indexed Access Types*/
/* (ссылка на тс доку)[https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html#:~:text=Another%20example%20of%20indexing%20with%20an%20arbitrary%20type%20is%20using%20number]*/

export type HeaderField = (typeof HEADER_FIELDS)[number]
export type FooterField = (typeof FOOTER_FIELDS)[number]
export type TitleField = (typeof TITLE_FIELDS)[number]
export type TableField = (typeof TABLE_FIELDS)[number]
