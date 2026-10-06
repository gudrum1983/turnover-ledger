import type { I18nLocaleMessages } from '../../types'
import { srLatInfoPage } from './infoPage'

export const srLatUi = {
  appHeaderTitle: 'KPO knjiga',
  languageSettings: {
    title: 'Jezik interfejsa i izveštaja',
    interfaceLabel: 'Jezik interfejsa',
    interfaceDescription:
      'Izaberite jezik dugmadi, polja, saveta i poruka u aplikaciji. Ovo podešavanje ne utiče na jezik štampanog izveštaja.',
    reportLabel: 'Pismo izveštaja',
    reportShortLabel: 'Izveštaj',
    reportDescription:
      'KPO knjiga se izrađuje samo na srpskom jeziku. Izaberite pismo dokumenta: latinicu ili ćirilicu. Ovo podešavanje ne menja jezik interfejsa.',
    reportHelper: 'Pismo izveštaja možete promeniti ovde ili na stranici za pregled izveštaja.',
  },
  common: {
    clearField: 'Obrisi polje',
  },
  reportBuilderActions: {
    preview: 'Pretpregled',
    export: 'Izvoz podataka',
    import: 'Uvoz podataka',
    exportShort: 'Izvoz',
    importShort: 'Uvoz',
  },
  importDataModal: {
    title: 'Uvesti podatke?',
    description: 'Trenutni podaci će biti u potpunosti zamenjeni podacima iz uvezenog fajla.',
    confirm: 'Uvezi',
    cancel: 'Otkaži',
    close: 'Zatvori',
    rowsInTable: 'redova u tabeli',
    invalidFileTitle: 'Uvoz podataka nije uspeo',
    invalidFile: 'Uvoz nije uspeo. Proverite da li je fajl ispravan JSON izvoz iz ove aplikacije.',
  },
  reportBuilderSections: {
    taxpayerInfo: 'Informacije o poreskom obvezniku',
    responsiblePeople: 'Odgovorna lica',
    incomeRecords: 'Ostvareni prihodi',
  },
  reportBuilderMetaFields: {
    taxpayerInfo: {
      pib: {
        label: 'PIB',
        placeholder: '123456789',
        hint: '"PIB" iz izvoda APR',
      },
      taxpayer: {
        label: 'Obveznik',
        placeholder: 'Ivan Markov',
        hint: '"Име и презиме" iz izvoda APR',
      },
      companyName: {
        label: 'Firma – radnja',
        placeholder: 'IVAN MARKOV PR BEOGRAD',
        hint: '"Пословно име" iz izvoda APR',
      },
      address: {
        label: 'Sedište',
        placeholder: 'ЈУГ-БОГДАНОВА 45, стан 16, БЕОГРАД, САВСКИ ВЕНАЦ, Србијя',
        hint: '"Адреса седишта" iz izvoda APR',
      },
      taxNumber: {
        label: 'Šifra poreskog obveznika',
        placeholder: '12345678',
        hint: '"Регистарски/матични брой" iz izvoda APR',
      },
      activityCode: {
        label: 'Šifra delatnosti',
        placeholder: '6201 - Рачунарско програмирање',
        hint: '"Претежна делатност" iz izvoda APR',
      },
    },
    responsiblePeople: {
      editSeparately: 'Uredi zasebno',
      sameAsTaxpayer: 'Isto kao obveznik',
      separateHint: 'Popunjavaju se zasebno',
      taxpayerHint: 'Popuniće se iz polja „Obveznik“',
      preparedBy: {
        label: 'Sastavio',
        placeholder: 'Ivan Markov',
        hint: '',
      },
      responsiblePerson: {
        label: 'Odgovorno lice',
        placeholder: 'Ivan Markov',
        hint: '',
      },
    },
    incomeRecordsForm: {
      date: {
        label: 'Datum',
        placeholder: 'DD.MM.GGGG',
        hint: 'Datum fakture',
      },
      description: {
        label: 'Income description',
        placeholder: 'Фактура бр.25, Клијент - Beta Box d.o.o. Beograd',
        hint: 'Broj fakture (preporučljivo i naziv kupca)',
      },
      goodsAmount: {
        label: 'Iznos robe',
        placeholder: '0,00',
        hint: 'Iznos prihoda po fakturi od prodaje robe',
      },
      servicesAmount: {
        label: 'Iznos usluga',
        placeholder: '0,00',
        hint: 'Iznos prihoda po fakturi od pruženih usluga',
      },
    },
  },
  reportBuilderIncomeRecordsTable: {
    rowNumber: 'Br.',
    description: 'Datum i opis',
    income: 'Prihod',
    currency: 'Valuta',
    addRow: 'Dodaj red',
    clearTable: 'Obriši tabelu',
    sortByDate: 'Sortiraj po datumu',
    emptyHint: 'Tabela je prazna, dodajte red',
    total: 'Ukupno',
    totalLimitExceeded: 'Upozorenje: ukupan iznos je premašio limit',
  },
  reportBuilderIncomeRecordsRow: {
    goodsShort: 'Rob.',
    servicesShort: 'Usl.',
    subtotalShort: 'Sve.',
    edit: 'Izmeni',
    copy: 'Kopiraj',
    remove: 'Obriši',
  },
  reportRowForm: {
    currency: 'Valuta',
    total: 'Ukupno',
    calculate: 'Izračunaj',
    officialRatePrefix: 'Zvanični srednji kurs RSD (NBS)',
    recalculateHint: 'Preračunajte nakon izmena.',
    currencyLoadError: 'Lista valuta nije učitana. Pokušajte ponovo kasnije.',
    calculationError: 'Nije moguće dobiti kurs i završiti obračun. Proverite datum i pokušajte ponovo.',
    goodsRsd: 'Roba (RSD)',
    servicesRsd: 'Usluge (RSD)',
    totalRsd: 'Ukupno (RSD)',
    row: 'Red',
    cancel: 'Otkaži',
    titleAdd: 'Dodaj red',
    titleEdit: 'Izmena reda',
    submit: 'Sačuvaj',
  },
  tableAlerts: {
    annualLimit: {
      message: 'Limit prekoračen',
      hint: 'Prihod za godinu prelazi 6.000.000 RSD.',
    },
    sortByDate: {
      message: 'Nije po datumu',
      hint: 'Sortirajte zapise po datumu — od ranijih ka kasnijim.',
    },
    differentYears: {
      message: 'Različite godine',
      hint: 'Jedan izveštaj treba da ima samo jednu godinu.',
    },
  },
  reportPreview: {
    toHome: 'Na početnu',
    print: 'ŠTAMPA / PDF',
    printHint: 'Da biste sačuvali PDF, u prozoru za štampu izaberite PDF kao odredište ili štampač.',
  },
  deleteRowModal: {
    title: 'Obrisati zapis?',
    description: 'Ova radnja se ne može opozvati.',
    confirm: 'Obriši',
    cancel: 'Otkaži',
  },
  deleteAllRowsModal: {
    title: 'Obrisati sve zapise?',
    description: 'Svi podaci će biti trajno uklonjeni.',
    confirm: 'Obriši sve',
    cancel: 'Otkaži',
  },
  reportPreviewScriptSwitcher: {
    label: ' Izveštaj',
    latin: 'Latinica',
    cyrillic: 'Ћирилица',
  },
  noPageMessage: {
    link: 'Nazad na početnu stranicu',
    title: 'Stranica se izgubila...',
    subtitle:
      'Izgleda da ju je neko istrgnuo iz knjige.\nAli uvek možete da se vratite na početnu stranicu i nastavite sa radom.',
  },
  footer: {
    bookTitle: 'KPO knjiga',
    development: 'Razvoj',
    design: 'Dizajn',
    developerName: 'Ekaterina Kochkina',
    designerName: 'Maxim Kamenshchikov',
    localStorageNotice: 'Svi podaci izveštaja ostaju u Vašem pregledaču',
    about: 'O\u00A0aplikaciji',
  },
  infoPage: srLatInfoPage,
  accessibility: {
    expandSection: 'Proširi sekciju',
    collapseSection: 'Skupi sekciju',
  },
} as const satisfies I18nLocaleMessages['ui']
