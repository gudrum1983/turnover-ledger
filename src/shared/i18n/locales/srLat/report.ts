import type { I18nLocaleMessages } from '../../types'

export const srLatReport = {
  header: {
    pib: 'PIB',
    taxpayer: 'Obveznik',
    companyName: 'Firma – radnja',
    address: 'Sedište',
    taxNumber: 'Šifra poreskog obveznika',
    activityCode: 'Šifra delatnosti',
  },
  title: {
    firstLine: 'Knjiga o ostvarenoj delatnosti',
    secondLine: 'paušalno oporezovanih obveznika',
  },
  table: {
    rowNumber: 'Redni broj',
    dateAndDescription: 'Datum i opis knjiženja',
    income: 'PRIHOD OD DELATNOSTI',
    incomeFromProducts: 'оd prodaje proizvoda',
    incomeFromServices: 'od izvršenih usluga',
    totalIncome: 'Svega prihod od delatnosti (3 + 4)',
  },
  footer: {
    preparedBy: 'Sastavio',
    responsiblePerson: 'Odgovorno lice',
  },
} as const satisfies I18nLocaleMessages['report']
