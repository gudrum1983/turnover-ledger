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
        label: 'Company name',
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
    incomeRecordsForm: {
      date: {
        label: 'Date',
        placeholder: 'DD.MM.YYYY',
        hint: 'Invoice date',
      },
      description: {
        label: 'Income description',
        placeholder: 'Фактура бр.25, Клијент - Beta Box d.o.o. Beograd',
        hint: 'Invoice number (buyer name is also recommended)',
      },
      goodsAmount: {
        label: 'Goods amount',
        placeholder: '0.00',
        hint: 'Income amount per invoice from the sale of goods',
      },
      servicesAmount: {
        label: 'Services amount',
        placeholder: '0.00',
        hint: 'Income amount per invoice from services provided',
      },
    },
  },
  reportBuilderIncomeRecordsTable: {
    rowNumber: 'No.',
    description: 'Date and description',
    income: 'Income',
    currency: 'Currency',
    addRow: 'Add row',
    clearTable: 'Clear table',
    sortByDate: 'Sort by date',
    emptyHint: 'The table is empty, add a row',
    total: 'Total',
    totalLimitExceeded: 'Warning: the total amount exceeded the limit of',
  },
  reportBuilderIncomeRecordsRow: {
    goodsShort: 'Gds.',
    servicesShort: 'Srv.',
    subtotalShort: 'Sub.',
    edit: 'Edit',
    copy: 'Copy',
    remove: 'Delete',
  },
  reportRowForm: {
    currency: 'Currency',
    total: 'Total',
    calculate: 'Calculate',
    officialRatePrefix: 'Official middle RSD exchange rate (NBS)',
    recalculateHint: 'Recalculate after any changes.',
    goodsRsd: 'Goods (RSD)',
    servicesRsd: 'Services (RSD)',
    totalRsd: 'Total (RSD)',
    row: 'Row',
    cancel: 'Cancel',
    titleAdd: 'Add new row',
    titleEdit: 'Edit row',
    submit: 'Save',
  },
  tableAlerts: {
    annualLimit: {
      message: 'Limit exceeded',
      hint: 'Income for the year exceeds 6,000,000 RSD.',
    },
    sortByDate: {
      message: 'Not sorted',
      hint: 'Sort records by date from earliest to latest.',
    },
    differentYears: {
      message: 'Different years',
      hint: 'A report should include only one year.',
    },
  },
  reportPreview: {
    toHome: 'Back home',
    print: 'PRINT',
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
  reportPreviewScriptSwitcher: {
    label: 'Report',
    latin: 'Latinica',
    cyrillic: 'Ћирилица',
  },
  accessibility: {
    expandSection: 'Expand section',
    collapseSection: 'Collapse section',
  },
} as const satisfies I18nLocaleMessages['ui']
