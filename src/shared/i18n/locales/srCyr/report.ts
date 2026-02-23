import type { I18nLocaleMessages } from '../../types'

export const srCyrReport = {
  header: {
    pib: 'ПИБ',
    taxpayer: 'Обвезник',
    companyName: 'Фирма – радња',
    address: 'Седиште',
    taxNumber: 'Шифра пореског обвезника',
    activityCode: 'Шифра делатности',
  },
  title: {
    firstLine: 'Књига о оствареној делатности',
    secondLine: 'паушално опорезованих обвезника',
  },
  table: {
    rowNumber: 'Редни број',
    dateAndDescription: 'Датум и опис књижења',
    income: 'ПРИХОД ОД ДЕЛАТНОСТИ',
    incomeFromProducts: 'од продаје производа',
    incomeFromServices: 'од извршених услуга',
    totalIncome: 'Свега приход од делатности (3 + 4)',
  },
  footer: {
    preparedBy: 'Саставио',
    responsiblePerson: 'Одговорно лице',
  },
} as const satisfies I18nLocaleMessages['report']
