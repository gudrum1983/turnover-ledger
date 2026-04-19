import type { ReportScript } from './types'
import type { FooterField, HeaderField, TableField, TitleField } from './fields'

type DictionaryEntry = {
  srLat: string
  srCyr: string
}

export const REPORT_LABELS = {
  header: {
    pib: {
      srLat: 'PIB',
      srCyr: 'ПИБ',
    },
    taxpayer: {
      srLat: 'Obveznik',
      srCyr: 'Обвезник',
    },
    companyName: {
      srLat: 'Firma – radnja',
      srCyr: 'Фирма – радња',
    },
    address: {
      srLat: 'Sedište',
      srCyr: 'Седиште',
    },
    taxNumber: {
      srLat: 'Šifra poreskog obveznika',
      srCyr: 'Шифра пореског обвезника',
    },
    activityCode: {
      srLat: 'Šifra delatnosti',
      srCyr: 'Шифра делатности',
    },
  },
  title: {
    firstLine: {
      srLat: 'Knjiga o ostvarenoj delatnosti',
      srCyr: 'Књига о оствареној делатности',
    },
    secondLine: {
      srLat: 'paušalno oporezovanih obveznika',
      srCyr: 'паушално опорезованих обвезника',
    },
  },
  table: {
    rowNumber: {
      srLat: 'Redni broj',
      srCyr: 'Редни број',
    },
    dateAndDescription: {
      srLat: 'Datum i opis knjiženja',
      srCyr: 'Датум и опис књижења',
    },
    income: {
      srLat: 'PRIHOD OD DELATNOSTI',
      srCyr: 'ПРИХОД ОД ДЕЛАТНОСТИ',
    },
    incomeFromProducts: {
      srLat: 'оd prodaje proizvoda',
      srCyr: 'oд продаје производа',
    },
    incomeFromServices: {
      srLat: 'od izvršenih usluga',
      srCyr: 'од извршених услуга',
    },
    totalIncome: {
      srLat: 'Svega prihod od delatnosti (3 + 4)',
      srCyr: 'Свега приход од делатности (3 + 4)',
    },
  },
  footer: {
    preparedBy: {
      srLat: 'Sastavio',
      srCyr: 'Саставио',
    },
    responsiblePerson: {
      srLat: 'Odgovorno lice',
      srCyr: 'Одговорно лице',
    },
  },
} satisfies {
  header: Record<HeaderField, DictionaryEntry>
  title: Record<TitleField, DictionaryEntry>
  table: Record<TableField, DictionaryEntry>
  footer: Record<FooterField, DictionaryEntry>
}

export const REPORT_TOTAL_LABEL_BY_SCRIPT: Record<ReportScript, string> = {
  srLat: 'Ukupno',
  srCyr: 'Укупно',
}

export const getReportHeaderLabel = (field: HeaderField, script: ReportScript) => REPORT_LABELS.header[field][script]
export const getReportFooterLabel = (field: FooterField, script: ReportScript) => REPORT_LABELS.footer[field][script]
export const getReportTitleLabel = (field: TitleField, script: ReportScript) => REPORT_LABELS.title[field][script]
export const getReportTableLabel = (field: TableField, script: ReportScript) => REPORT_LABELS.table[field][script]
export const getReportTotalLabel = (script: ReportScript) => REPORT_TOTAL_LABEL_BY_SCRIPT[script]
