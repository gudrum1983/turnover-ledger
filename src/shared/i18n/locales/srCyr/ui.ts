import type { I18nLocaleMessages } from '../../types'

export const srCyrUi = {
  app: {
    headerTitle: 'КПО књига (паушал)',
  },
  reportActions: {
    preview: 'Преглед',
    export: 'Извоз података',
    import: 'Увоз података',
  },
  importData: {
    title: 'Увести податке?',
    description: 'Тренутни подаци ће бити у потпуности замењени подацима из увезеног фајла.',
    confirm: 'Увези',
    cancel: 'Откажи',
    close: 'Затвори',
    rowsInTable: 'редова у табели',
    invalidFileTitle: 'Увоз података није успео',
    invalidFile: 'Увоз није успео. Проверите да ли је фајл исправан JSON извоз из ове апликације.',
  },
  reportMetaForm: {
    taxpayerInfo: 'Информације о пореском обвезнику',
    responsiblePeople: 'Одговорна лица',
  },
  reportMetaFields: {
    header: {
      pib: {
        label: 'ПИБ',
        placeholder: '123456789',
        hint: '"PIB" из извода АПР',
      },
      taxpayer: {
        label: 'Обвезник',
        placeholder: 'Ivan Markov',
        hint: '"Име и презиме" из извода АПР',
      },
      companyName: {
        label: 'Фирма - радње',
        placeholder: 'IVAN MARKOV PR BEOGRAD',
        hint: '"Пословно име" из извода АПР',
      },
      address: {
        label: 'Седиште',
        placeholder: 'ЈУГ-БОГДАНОВА 45, стан 16, БЕОГРАД, САВСКИ ВЕНАЦ, Србијя',
        hint: '"Адреса седишта" из извода АПР',
      },
      taxNumber: {
        label: 'Шифра пореског обвезника',
        placeholder: '12345678',
        hint: '"Регистарски/матични брой" из извода АПР',
      },
      activityCode: {
        label: 'Шифра делатности',
        placeholder: '6201 - Рачунарско програмирање',
        hint: '"Претежна делатност" из извода АПР',
      },
    },
    footer: {
      preparedBy: {
        label: 'Саставио',
        placeholder: 'Ivan Markov',
        hint: '',
      },
      responsiblePerson: {
        label: 'Одговорно лице',
        placeholder: 'Ivan Markov',
        hint: '',
      },
    },
  },
  reportTable: {
    rowNumber: 'Бр.',
    income: 'Приход',
    currency: 'Валута',
    addRow: 'Додај ред',
    clearTable: 'Обриши табелу',
    emptyHint: 'Табела је празна, додајте ред ...',
    total: 'Укупно',
    totalLimitExceeded: 'Упозорење: укупан износ је премашио лимит',
    addRowModalTitle: 'Додај ред',
    cancel: 'Откажи',
    add: 'Додај',
    editAlert: 'Измена реда',
  },
  reportTableRow: {
    goodsShort: 'Роб.',
    servicesShort: 'Усл.',
    subtotalShort: 'Св.',
    edit: 'Измени',
    copy: 'Копирај',
    remove: 'Обриши',
  },
  reportRowForm: {
    date: 'Датум',
    currency: 'Валута',
    description: 'Опис',
    descriptionPlaceholder: 'Сврха плаћања',
    goodsAmount: 'Износ робе',
    servicesAmount: 'Износ услуга',
    total: 'Укупно',
    calculate: 'Израчунај',
    officialRatePrefix: 'ЗВАНИЧНИ СРЕДЊИ КУРС ДИНАРА',
    recalculateHint: 'Прерачунајте након измена.',
    goodsRsd: 'Роба (RSD)',
    servicesRsd: 'Услуге (RSD)',
    totalRsd: 'Укупно (RSD)',
    row: 'Ред',
  },
  reportPreview: {
    toHome: 'На почетну',
    print: 'ШТАМПА',
  },
  deleteRowModal: {
    title: 'Обрисати запис?',
    description: 'Ова радња се не може опозвати.',
    confirm: 'Обриши',
    cancel: 'Откажи',
  },
  deleteAllRowsModal: {
    title: 'Обрисати све записе?',
    description: 'Сви подаци ће бити трајно уклоњени.',
    confirm: 'Обриши све',
    cancel: 'Откажи',
  },
  languageSwitcher: {
    reportScript: 'Писмо извештаја',
    reportScriptLatin: 'Латиница',
    reportScriptCyrillic: 'Ћирилица',
  },
  accessibility: {
    expandSection: 'Прошири секцију',
    collapseSection: 'Скупи секцију',
  },
} as const satisfies I18nLocaleMessages['ui']
