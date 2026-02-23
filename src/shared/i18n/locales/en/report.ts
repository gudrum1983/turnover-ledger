import type { I18nLocaleMessages } from '../../types'

export const enReport = {
  header: {
    pib: 'Tax ID (PIB)',
    taxpayer: 'Taxpayer',
    companyName: 'Business name',
    address: 'Registered address',
    taxNumber: 'Taxpayer code',
    activityCode: 'Activity code',
  },
  title: {
    firstLine: 'Book of Realized Turnover',
    secondLine: '(Lump-Sum Taxation)',
  },
  table: {
    rowNumber: 'No.',
    dateAndDescription: 'Date and description',
    income: 'INCOME',
    incomeFromProducts: 'from goods',
    incomeFromServices: 'from services',
    totalIncome: 'Total income (3 + 4)',
  },
  footer: {
    preparedBy: 'Prepared by',
    responsiblePerson: 'Responsible person',
  },
} as const satisfies I18nLocaleMessages['report']
