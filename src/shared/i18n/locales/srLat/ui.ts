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
    nothingFound: 'Nema rezultata',
    showAll: 'Prikaži sve',
  },
  reportYearSelect: {
    buttonLabel: 'Izveštaj za {year}. godinu',
    buttonMiddleLabel: 'za {year}. godinu',
    year: 'Izveštaj za {year}. godinu',
    noRecords: '(nema zapisa)',
    records: {
      one: '({count} zapis)',
      few: '({count} zapisa)',
      many: '({count} zapisa)',
      other: '({count} zapisa)',
    },
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
    validation: {
      personName: 'Unesite ime i prezime slovima. Dozvoljeni su crtica i apostrof.',
      pib: 'Unesite tačno 9 ili 13 cifara.',
      taxNumber: 'Unesite tačno 8 ili 13 cifara.',
      activityCode: 'Polje mora sadržati 4 cifre.',
    },
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
      taxpayerHint: 'Podudaraju se sa poljem „Obveznik“',
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
        pickPlaceholder: 'Izaberite datum u {year}. godini',
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
    date: 'Datum',
    description: 'Опис',
    income: 'Prihod',
    currency: 'Valuta',
    addRow: 'Dodaj zapis',
    clearTable: 'Obriši sve',
    clearYear: 'Očisti godinu',
    sortByDate: 'Sortiraj po datumu',
    emptyHint: 'Tabela je prazna, dodajte red',
    emptyTitle: 'Za {year}. godinu još nema zapisa',
    emptySubtitle: 'Dodajte prvi zapis o prihodu',
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
    actions: 'Radnje sa zapisom',
  },
  reportRowForm: {
    currency: 'Valuta',
    allCurrencies: 'Sve valute „NBS“',
    currencyHint:
      'Bez datuma prikazana je opšta lista valuta NBS, koja ne garantuje da valuta ima kurs na određeni dan. Kada izaberete datum, ostaju samo valute sa kursom za taj dan.',
    currencyNoRateError: 'Ova valuta nema kurs NBS na izabrani datum. Izaberite drugu valutu ili datum.',
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
    pausalLimit: {
      message: 'Prekoračen limit za paušal',
      description: 'Limit: 6 mil. RSD za kalendarsku godinu',
    },
    pdvLimit: {
      message: 'Prekoračen prag za PDV',
      description: 'Prag za obavezan ulazak u sistem PDV-a: 8\u00A0mil.\u00A0RSD za 12 uzastopnih meseci',
      details: 'Promet na dan {date}: {amount}\u00A0RSD',
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
    description: 'Obrisani zapis neće moći da se vrati.',
    confirm: 'Obriši',
    cancel: 'Otkaži',
  },
  deleteAllRowsModal: {
    title: 'Obrisati sve zapise?',
    description: 'Obrisani zapisi neće moći da se vrate. Da biste sačuvali kopiju, prvo izvezite podatke.',
    confirm: 'Obriši sve',
    cancel: 'Otkaži',
  },
  deleteYearRowsModal: {
    title: 'Očistiti {year}. godinu?',
    summary:
      'Biće obrisan {count} zapis u iznosu od {amount} RSD. | Biće obrisana {count} zapisa u iznosu od {amount} RSD. | Biće obrisano {count} zapisa u iznosu od {amount} RSD.',
    description: 'Obrisani zapisi neće moći da se vrate. Da biste sačuvali kopiju, prvo izvezite podatke.',
    confirm: 'Očisti godinu',
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
    localStorageNotice: 'Svi podaci izveštaja ostaju u Vašem pregledaču',
    about: 'O\u00A0aplikaciji',
  },
  infoPage: srLatInfoPage,
  accessibility: {
    expandSection: 'Proširi sekciju',
    collapseSection: 'Skupi sekciju',
  },
} as const satisfies I18nLocaleMessages['ui']
