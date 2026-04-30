import type { I18nLocaleMessages } from '../../types'
import { srCyrInfoPage } from './infoPage'

export const srCyrUi = {
  appHeaderTitle: 'КПО књига (паушал)',
  common: {
    clearField: 'Обриши поље',
  },
  reportBuilderActions: {
    preview: 'Преглед',
    export: 'Извоз података',
    import: 'Увоз података',
  },
  importDataModal: {
    title: 'Увести податке?',
    description: 'Тренутни подаци ће бити у потпуности замењени подацима из увезеног фајла.',
    confirm: 'Увези',
    cancel: 'Откажи',
    close: 'Затвори',
    rowsInTable: 'редова у табели',
    invalidFileTitle: 'Увоз података није успео',
    invalidFile: 'Увоз није успео. Проверите да ли је фајл исправан JSON извоз из ове апликације.',
  },
  reportBuilderSections: {
    taxpayerInfo: 'Информације о пореском обвезнику',
    responsiblePeople: 'Одговорна лица',
    incomeRecords: 'Остварени приходи',
  },
  reportBuilderMetaFields: {
    taxpayerInfo: {
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
    responsiblePeople: {
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
    incomeRecordsForm: {
      date: {
        label: 'Датум',
        placeholder: 'ДД.ММ.ГГГГ',
        hint: 'Датум фактуре',
      },
      description: {
        label: 'Описание дохода',
        placeholder: 'Фактура бр.25, Клијент - Beta Box d.o.o. Beograd',
        hint: 'Број фактуре (препоручљиво и назив купца)',
      },
      goodsAmount: {
        label: 'Износ робе',
        placeholder: '0,00',
        hint: 'Износ прихода по фактури од продаје робе',
      },
      servicesAmount: {
        label: 'Износ услуга',
        placeholder: '0,00',
        hint: 'Износ прихода по фактури од пружених услуга',
      },
    },
  },
  reportBuilderIncomeRecordsTable: {
    rowNumber: 'Бр.',
    description: 'Датум и опис',
    income: 'Приход',
    currency: 'Валута',
    addRow: 'Додај ред',
    clearTable: 'Обриши табелу',
    sortByDate: 'Сортирај по датуму',
    emptyHint: 'Табела је празна, додајте ред',
    total: 'Укупно',
    totalLimitExceeded: 'Упозорење: укупан износ је премашио лимит',
  },
  reportBuilderIncomeRecordsRow: {
    goodsShort: 'Роб.',
    servicesShort: 'Усл.',
    subtotalShort: 'Св.',
    edit: 'Измени',
    copy: 'Копирај',
    remove: 'Обриши',
  },
  reportRowForm: {
    currency: 'Валута',
    total: 'Укупно',
    calculate: 'Израчунај',
    officialRatePrefix: 'Званични средњи курс RSD (NBS)',
    recalculateHint: 'Прерачунајте након измена.',
    goodsRsd: 'Роба (RSD)',
    servicesRsd: 'Услуге (RSD)',
    totalRsd: 'Укупно (RSD)',
    row: 'Ред',
    cancel: 'Откажи',
    titleAdd: 'Додај ред',
    titleEdit: 'Измена реда',
    submit: 'Сачувај',
  },
  tableAlerts: {
    annualLimit: {
      message: 'Лимит прекорачен',
      hint: 'Приход за годину прелази 6.000.000 RSD.',
    },
    sortByDate: {
      message: 'Није по датуму',
      hint: 'Сортирајте записе по датуму — од ранијих ка каснијим.',
    },
    differentYears: {
      message: 'Различите године',
      hint: 'Један извештај треба да има само једну годину.',
    },
  },
  reportPreview: {
    toHome: 'На почетну',
    print: 'ШТАМПА / PDF',
    printHint: 'Да бисте сачували PDF, у прозору за штампу изаберите PDF као одредиште или штампач.',
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
  reportPreviewScriptSwitcher: {
    label: 'Извештај',
    latin: 'Latinica',
    cyrillic: 'Ћирилица',
  },
  noPageMessage: {
    link: 'Полако — идемо назад',
    title: 'Страница није пронађена',
    subtitle: 'Ништа страшно, само сте мало скренули.',
  },
  footer: {
    localStorageNotice: 'Сви подаци извештаја остају у Вашем прегледачу',
    about: 'О апликацији',
  },
  infoPage: srCyrInfoPage,
  accessibility: {
    expandSection: 'Прошири секцију',
    collapseSection: 'Скупи секцију',
  },
} as const satisfies I18nLocaleMessages['ui']
