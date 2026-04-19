import type { I18nLocaleMessages } from '../../types'

export const enUi = {
  appHeaderTitle: 'KPO Book (Paušal)',
  common: {
    clearField: 'Clear field',
  },
  reportBuilderActions: {
    preview: 'Preview',
    export: 'Export data',
    import: 'Import data',
  },
  importDataModal: {
    title: 'Import data?',
    description: 'Current data will be fully replaced with the imported file.',
    confirm: 'Import',
    cancel: 'Cancel',
    close: 'Close',
    rowsInTable: 'rows in the table',
    invalidFileTitle: 'Import failed',
    invalidFile: 'Import failed. Make sure the file is a valid JSON export from this app.',
  },
  reportBuilderSections: {
    taxpayerInfo: 'Taxpayer information',
    responsiblePeople: 'Responsible persons',
    incomeRecords: 'Income Records',
  },
  reportBuilderMetaFields: {
    taxpayerInfo: {
      pib: {
        label: 'PIB',
        placeholder: '123456789',
        hint: '"PIB" from the SBRA excerpt (АПР Извод)',
      },
      taxpayer: {
        label: 'Taxpayer',
        placeholder: 'Ivan Markov',
        hint: '"Име и презиме" from the SBRA excerpt (АПР Извод)',
      },
      companyName: {
        label: 'Company / shop',
        placeholder: 'IVAN MARKOV PR BEOGRAD',
        hint: '"Пословно име" from the SBRA excerpt (АПР Извод)',
      },
      address: {
        label: 'Registered office',
        placeholder: 'ЈУГ-БОГДАНОВА 45, стан 16, БЕОГРАД, САВСКИ ВЕНАЦ, Србијя',
        hint: '"Адреса седишта" from the SBRA excerpt (АПР Извод)',
      },
      taxNumber: {
        label: 'Taxpayer code',
        placeholder: '12345678',
        hint: '"Регистарски/матични брой" from the SBRA excerpt (АПР Извод)',
      },
      activityCode: {
        label: 'Activity code',
        placeholder: '6201 - Рачунарско програмирање',
        hint: '"Претежна делатност" from the SBRA excerpt (АПР Извод)',
      },
    },
    responsiblePeople: {
      preparedBy: {
        label: 'Prepared by',
        placeholder: 'Ivan Markov',
        hint: '',
      },
      responsiblePerson: {
        label: 'Responsible person',
        placeholder: 'Ivan Markov',
        hint: '',
      },
    },
  },
  reportTable: {
    rowNumber: 'No.',
    income: 'Income',
    currency: 'Currency',
    addRow: 'Add row',
    clearTable: 'Clear table',
    emptyHint: 'The table is empty, add a row ...',
    total: 'Total',
    totalLimitExceeded: 'Warning: the total amount exceeded the limit of',
    addRowModalTitle: 'Add row',
    cancel: 'Cancel',
    add: 'Add',
    editAlert: 'Edit row',
  },
  reportTableRow: {
    goodsShort: 'Gds.',
    servicesShort: 'Srv.',
    subtotalShort: 'Sub.',
    edit: 'Edit',
    copy: 'Copy',
    remove: 'Delete',
  },
  reportRowForm: {
    date: 'Date',
    currency: 'Currency',
    description: 'Description',
    descriptionPlaceholder: 'Payment purpose',
    goodsAmount: 'Goods amount',
    servicesAmount: 'Services amount',
    total: 'Total',
    calculate: 'Calculate',
    officialRatePrefix: 'OFFICIAL MIDDLE RSD EXCHANGE RATE',
    recalculateHint: 'Recalculate after any changes.',
    goodsRsd: 'Goods (RSD)',
    servicesRsd: 'Services (RSD)',
    totalRsd: 'Total (RSD)',
    row: 'Row',
  },
  reportPreview: {
    toHome: 'Back home',
    print: 'PRINT',
  },
  reportLabels: {
    title: 'Book of performed business activity for lump-sum taxed taxpayers',
    table: {
      rowNumber: 'Ordinal number',
      dateAndDescription: 'Date and description of entry',
      income: 'BUSINESS INCOME',
      incomeFromProducts: 'from the sale of products',
      incomeFromServices: 'from services rendered',
      totalIncome: 'Total business income (3 + 4)',
      total: 'Total',
    },
  },
  deleteRowModal: {
    title: 'Delete this record?',
    description: 'This action cannot be undone.',
    confirm: 'Delete',
    cancel: 'Cancel',
  },
  deleteAllRowsModal: {
    title: 'Delete all records?',
    description: 'All data will be permanently removed.',
    confirm: 'Delete all',
    cancel: 'Cancel',
  },
  languageSwitcher: {
    reportScript: 'Report script',
    reportScriptLatin: 'Latinica',
    reportScriptCyrillic: 'Cyrillic',
  },
  accessibility: {
    expandSection: 'Expand section',
    collapseSection: 'Collapse section',
  },
} as const satisfies I18nLocaleMessages['ui']
