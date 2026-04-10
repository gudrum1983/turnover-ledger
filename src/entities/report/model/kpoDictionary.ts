import type { FooterField, HeaderField, TableField, TitleField } from './reportFields'

type DictionaryEntry = {
  ru: string
  srLat: string
  srCyr: string
  en: string
}

export const KPO_DICTIONARY = {
  header: {
    pib: {
      ru: 'ПИБ',
      srLat: 'PIB',
      srCyr: 'ПИБ',
      en: 'Tax ID (PIB)',
    },
    taxpayer: {
      ru: 'Налогоплательщик (имя и фамилия)',
      srLat: 'Obveznik',
      srCyr: 'Обвезник',
      en: 'Taxpayer',
    },
    companyName: {
      ru: 'Фирма',
      srLat: 'Firma – radnja',
      srCyr: 'Фирма – радња',
      en: 'Business name',
    },
    address: {
      ru: 'Юридический адрес',
      srLat: 'Sedište',
      srCyr: 'Седиште',
      en: 'Registered address',
    },
    taxNumber: {
      ru: 'Налоговый номер',
      srLat: 'Šifra poreskog obveznika',
      srCyr: 'Шифра пореског обвезника',
      en: 'Taxpayer code',
    },
    activityCode: {
      ru: 'Код деятельности',
      srLat: 'Šifra delatnosti',
      srCyr: 'Шифра делатности',
      en: 'Activity code',
    },
  },

  title: {
    firstLine: {
      ru: 'Книга о полученном доходе',
      srLat: 'Knjiga o ostvarenoj delatnosti',
      srCyr: 'Књига о оствареној делатности',
      en: 'Book of Realized Turnover',
    },
    secondLine: {
      ru: '(паушальное налогообложение)',
      srLat: 'paušalno oporezovanih obveznika',
      srCyr: 'паушално опорезованих обвезника',
      en: '(Lump-Sum Taxation)',
    },
  },

  table: {
    rowNumber: {
      ru: '№ п/п',
      srLat: 'Redni broj',
      srCyr: 'Редни број',
      en: 'No.',
    },
    dateAndDescription: {
      ru: 'Дата и описание операции',
      srLat: 'Datum i opis knjiženja',
      srCyr: 'Датум и опис књижења',
      en: 'Date and description',
    },
    income: {
      ru: 'ДОХОД',
      srLat: 'PRIHOD OD DELATNOSTI',
      srCyr: 'ПРИХОД ОД ДЕЛАТНОСТИ',
      en: 'INCOME',
    },
    incomeFromProducts: {
      ru: 'от продажи товаров',
      srLat: 'оd prodaje proizvoda',
      srCyr: 'oд продаје производа',
      en: 'from goods',
    },
    incomeFromServices: {
      ru: 'от оказанных услуг',
      srLat: 'od izvršenih usluga',
      srCyr: 'од извршених услуга',
      en: 'from services',
    },
    totalIncome: {
      ru: 'Общий доход (3 + 4)',
      srLat: 'Svega prihod od delatnosti (3 + 4)',
      srCyr: 'Свега приход од делатности (3 + 4)',
      en: 'Total income (3 + 4)',
    },
  },

  footer: {
    preparedBy: {
      ru: 'Составил',
      srLat: 'Sastavio',
      srCyr: 'Саставио',
      en: 'Prepared by',
    },
    responsiblePerson: {
      ru: 'Ответственное лицо',
      srLat: 'Odgovorno lice',
      srCyr: 'Одговорно лице',
      en: 'Responsible person',
    },
  },
} satisfies {
  header: Record<HeaderField, DictionaryEntry>
  title: Record<TitleField, DictionaryEntry>
  table: Record<TableField, DictionaryEntry>
  footer: Record<FooterField, DictionaryEntry>
}
