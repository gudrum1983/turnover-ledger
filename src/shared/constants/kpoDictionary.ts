import type { FooterField, HeaderField, TableField, TitleField } from '@/shared/constants/reportFields.ts'

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

/*todo - чем satisfies отличается от Record-аннотации
*
* https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
*
* • Да, вот короткий пример на твоем кейсе. С satisfies можно вытащить union из конкретных строк:

*
*
  import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
  import type { HeaderField } from '@/shared/constants/reportFields.ts'

  type HeaderRu = (typeof KPO_DICTIONARY.header)[HeaderField]['ru']
  // HeaderRu = 'ПИБ' | 'Налогоплательщик (имя и фамилия)' | 'Фирма' | ...

  То же для title или table:

  import type { TitleField } from '@/shared/constants/reportFields.ts'

  type TitleEn = (typeof KPO_DICTIONARY.title)[TitleField]['en']
  // TitleEn = 'Book of Realized Turnover' | '(Lump-Sum Taxation)'

  Если бы KPO_DICTIONARY был аннотирован как Record<..., DictionaryEntry>, то HeaderRu стало бы просто string — литералы потерялись бы.
*  */
