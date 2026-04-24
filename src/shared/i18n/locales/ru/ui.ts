export const ruUi = {
  appHeaderTitle: 'Книга КПО (паушал)',
  common: {
    clearField: 'Очистить поле',
  },
  reportBuilderActions: {
    preview: 'Просмотр',
    export: 'Экспорт данных',
    import: 'Импорт данных',
  },
  importDataModal: {
    title: 'Импортировать данные?',
    description: 'Текущие данные будут полностью заменены импортированными.',
    confirm: 'Импортировать',
    cancel: 'Отмена',
    close: 'Закрыть',
    rowsInTable: 'строк в таблице',
    invalidFileTitle: 'Не удалось импортировать данные',
    invalidFile: 'Не удалось импортировать файл. Проверьте, что это корректный JSON-экспорт приложения.',
  },
  reportBuilderSections: {
    taxpayerInfo: 'Информация о налогоплательщике',
    responsiblePeople: 'Ответственные лица',
    incomeRecords: 'Полученные доходы',
  },
  reportBuilderMetaFields: {
    taxpayerInfo: {
      pib: {
        label: 'ПИБ',
        placeholder: '123456789',
        hint: '"ПИБ" из выписки АПР',
      },
      taxpayer: {
        label: 'Налогоплательщик',
        placeholder: 'Ivan Markov',
        hint: '"Име и презиме" из выписки АПР',
      },
      companyName: {
        label: 'Название компании',
        placeholder: 'IVAN MARKOV PR BEOGRAD',
        hint: '"Пословно име" из выписки АПР',
      },
      address: {
        label: 'Адрес',
        placeholder: 'ЈУГ-БОГДАНОВА 45, стан 16, БЕОГРАД, САВСКИ ВЕНАЦ, Србијя',
        hint: '"Адреса седишта" из выписки АПР',
      },
      taxNumber: {
        label: 'Код налогоплательщика',
        placeholder: '12345678',
        hint: '"Регистарски/матични брой" из выписки АПР',
      },
      activityCode: {
        label: 'Код деятельности',
        placeholder: '6201 - Рачунарско програмирање',
        hint: '"Претежна делатност" из выписки АПР',
      },
    },
    responsiblePeople: {
      preparedBy: {
        label: 'Составил',
        placeholder: 'Ivan Markov',
        hint: '',
      },
      responsiblePerson: {
        label: 'Ответственное лицо',
        placeholder: 'Ivan Markov',
        hint: '',
      },
    },
    incomeRecordsForm: {
      date: {
        label: 'Дата',
        placeholder: 'ДД.ММ.ГГГГ',
        hint: 'Дата счета',
      },
      description: {
        label: 'Описание дохода',
        placeholder: 'Фактура бр.25, Клијент - Beta Box d.o.o. Beograd',
        hint: 'Номер счета (рекомендовано и наименование клиента, как он указан в счете)',
      },
      goodsAmount: {
        label: 'Сумма по товарам',
        placeholder: '0,00',
        hint: 'Сумма доходов по счету от продажи товаров',
      },
      servicesAmount: {
        label: 'Сумма по услугам',
        placeholder: '0,00',
        hint: 'Сумма доходов по счету от оказанных услуг',
      },
    },
  },
  reportBuilderIncomeRecordsTable: {
    rowNumber: '№',
    income: 'Доход',
    description: 'Дата и описание',
    currency: 'Валюта',
    addRow: 'Добавить строку',
    clearTable: 'Очистить таблицу',
    sortByDate: 'Сортировать по дате',
    emptyHint: 'Таблица пустая, добавьте строку',
    total: 'Итого',
    totalLimitExceeded: 'Предупреждение: общая сумма превысила лимит',
  },
  reportBuilderIncomeRecordsRow: {
    goodsShort: 'Тов.',
    servicesShort: 'Усл.',
    subtotalShort: 'Сум.',
    edit: 'Изменить',
    copy: 'Копировать',
    remove: 'Удалить',
  },
  reportRowForm: {
    currency: 'Валюта',
    total: 'Итого',
    calculate: 'Рассчитать',
    officialRatePrefix: 'Официальный средний обменный курс RSD (NBS)',
    recalculateHint: 'Пересчитайте после изменений.',
    goodsRsd: 'По товарам (RSD)',
    servicesRsd: 'По услугам (RSD)',
    totalRsd: 'Итого (RSD)',
    row: 'Строка',
    cancel: 'Отмена',
    titleAdd: 'Добавить новую строку',
    titleEdit: 'Редактирование строки',
    submit: 'Сохранить',
  },
  tableAlerts: {
    annualLimit: {
      message: 'Превышен лимит',
      hint: 'Доход за год превысил 6 000 000 RSD.',
    },
    sortByDate: {
      message: 'Не по дате',
      hint: 'Отсортируйте записи по дате — от ранних к поздним.',
    },
    differentYears: {
      message: 'Разные годы',
      hint: 'В одном отчёте должен быть только один год.',
    },
  },
  reportPreview: {
    toHome: 'На главную',
    print: 'ПЕЧАТЬ / PDF',
    printHint: 'Чтобы сохранить PDF, выберите PDF как место назначения или принтер в окне печати.',
  },
  deleteRowModal: {
    title: 'Удалить запись?',
    description: 'Это действие нельзя отменить.',
    confirm: 'Удалить',
    cancel: 'Отмена',
  },
  deleteAllRowsModal: {
    title: 'Удалить все записи?',
    description: 'Все данные будут удалены без возможности восстановления.',
    confirm: 'Удалить всё',
    cancel: 'Отмена',
  },
  reportPreviewScriptSwitcher: {
    label: 'Отчет',
    latin: 'Latinica',
    cyrillic: 'Ћирилица',
  },
  noPageMessage: {
    link: 'Спокойно — возвращаемся назад',
    title: 'Страница не найдена',
    subtitle: 'Ничего страшного, вы просто немного свернули не туда.',
  },
  accessibility: {
    expandSection: 'Развернуть секцию',
    collapseSection: 'Свернуть секцию',
  },
} as const
