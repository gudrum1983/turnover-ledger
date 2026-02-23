export const ruReport = {
  header: {
    pib: 'ПИБ',
    taxpayer: 'Налогоплательщик (имя и фамилия)',
    companyName: 'Фирма',
    address: 'Юридический адрес',
    taxNumber: 'Налоговый номер',
    activityCode: 'Код деятельности',
  },
  title: {
    firstLine: 'Книга о полученном доходе',
    secondLine: '(паушальное налогообложение)',
  },
  table: {
    rowNumber: '№ п/п',
    dateAndDescription: 'Дата и описание операции',
    income: 'ДОХОД',
    incomeFromProducts: 'от продажи товаров',
    incomeFromServices: 'от оказанных услуг',
    totalIncome: 'Общий доход (3 + 4)',
  },
  footer: {
    preparedBy: 'Составил',
    responsiblePerson: 'Ответственное лицо',
  },
} as const
