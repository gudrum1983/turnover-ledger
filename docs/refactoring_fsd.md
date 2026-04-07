# Рефакторинг FSD

Этот документ нужен как опорная схема для рефакторинга проекта по Feature-Sliced Design, чтобы не путаться в слоях и в назначении компонентов.

## Главная идея

В FSD слой определяется не размером компонента и не количеством использований, а смыслом ответственности.

Коротко:

- `app` — запуск приложения, роутер, провайдеры, глобальные стили, layout приложения
- `pages` — конкретные маршруты и их композиция
- `widgets` — крупные независимые блоки страницы
- `features` — пользовательские действия и сценарии
- `entities` — бизнес-сущности и всё вокруг них
- `shared` — переиспользуемая инфраструктура и dumb UI

## Как это читать на текущем проекте

В проекте сейчас есть такой домен:

- есть сущность `report`
- есть сценарий сборки отчёта
- есть сценарий предпросмотра и печати
- есть набор базовых UI-полей, кнопок и модалок

Из этого следует, что структура проекта может выглядеть так:

```text
src/
  app/
    router/
    stores/
    styles/
    App.vue

  pages/
    report-builder/
      ui/
        ReportBuilderPage.vue

    report-preview/
      ui/
        ReportPreviewPage.vue

    not-found/
      ui/
        NotFoundPage.vue

  widgets/
    page-header/
      ui/
        PageHeader.vue

  features/
    report-meta-form/
      ui/
        ReportMetaForm.vue

    report-row-form/
      ui/
        ReportRowForm.vue

    report-actions/
      ui/
        ReportActions.vue

    report-script-toggle/
      ui/
        ReportScriptToggle.vue

    report-row-manage/
      ui/
        ReportTableRowButton.vue

  entities/
    report/
      model/
        types.ts
        store.ts
        selectors.ts
      ui/
        ReportTable.vue
        ReportTableRow.vue
        ReportDocument.vue
        ReportDocumentRow.vue
      lib/
        format.ts
        totals.ts

  shared/
    ui/
    lib/
    api/
    types/
    constants/
    i18n/
```

Это не единственный возможный вариант, но для текущего проекта он выглядит гораздо чище текущей структуры.

## Что такое `app`

Сюда должны идти:

- роутер
- setup приложения
- pinia setup и глобальные app stores, если они действительно app-level
- глобальные стили
- app shell, если он действительно общий для приложения

Если компонент импортируется страницами напрямую, это не `app`.

Если `Header` рендерится layout-ом поверх большинства роутов, тогда это `app`.

### Вывод по текущему проекту

`AppHeader` в текущем виде лучше не держать в `app`.

Он больше похож на `widgets/page-header/ui/PageHeader.vue`.

## Что такое `pages`

`pages` должны:

- собирать экран маршрута
- подключать widgets, features, entities, shared
- содержать page-specific layout

Страница — это точка композиции маршрута, а не “всё подряд, что лежит на экране”.

### Для текущего проекта

В `pages` логично оставлять:

- `ReportBuilderPage`
- `ReportPreviewPage`
- `NotFoundPage`

## Что такое `widgets`

Вот здесь чаще всего и возникает путаница.

Widget — это:

- крупный самостоятельный блок интерфейса
- который имеет законченный смысл на странице
- который может собирать внутри `features`, `entities`, `shared`
- но сам ещё не является страницей

Что не является критерием:

- используется ли он больше одного раза
- большой ли это файл
- расположен ли он сверху страницы

### Для текущего проекта

Хороший кандидат в widget:

- `PageHeader`

Почему:

- это отдельный page block
- он может использоваться на разных страницах
- принимает title и action area
- не является пользовательской операцией
- не относится к сущности `report`

### Что сейчас не похоже на widgets

Следующие группы в текущем проекте не выглядят как настоящие widgets:

- `report-builder/*`
- `report-document/*`
- `report-preview/*`

Скорее всего это либо `features`, либо `entities`, либо page composition.

## Что такое `features`

Feature — это пользовательское действие или завершённый сценарий.

Полезные вопросы:

- что пользователь здесь делает?
- какой use case этот блок решает?

### Для текущего проекта

В features хорошо ложатся такие сценарии:

- редактирование метаданных отчёта
- добавление и редактирование строки отчёта
- импорт и экспорт отчёта
- переключение письменности документа

Поэтому в `features` хорошо смотрятся:

- `ReportMetaForm`
- `ReportRowForm`
- `ReportActions`
- `ReportScriptToggle`
- возможно `ReportTableRowButton`

Почему это features:

- у этих блоков есть пользовательский сценарий
- они не просто отображают данные
- они изменяют состояние или поведение

## Что такое `entities`

Entity — это бизнес-сущность предметной области.

У проекта основная сущность — `report`.

Также в проекте есть отдельная сущность `report-row`.

Это важно зафиксировать: в проекте планируются две entity:

- `report`
- `report-row`

В `entities/report` могут лежать:

- типы отчёта
- store и selectors
- функции подсчёта
- UI-представления отчёта

### Для текущего проекта

В `entities/report` хорошо ложатся:

- `ReportTable`
- `ReportTableRow`
- `ReportDocument`
- `ReportDocumentRow`

Почему:

- это отображение сущности отчёта и его данных
- это не самостоятельные пользовательские сценарии
- это не базовый UI

## Решение по двум entity

Для проекта фиксируется следующая модель:

- `report` — entity отчёта целиком
- `report-row` — entity отдельной строки отчёта

Это не конфликтует между собой.

`report` — это документ и агрегат верхнего уровня.
`report-row` — отдельный доменный объект внутри отчёта.

### Что относится к `report`

Сюда относятся:

- тип отчёта целиком
- метаданные отчёта
- список строк как часть отчёта
- документ отчёта на вывод и печать
- агрегирующие вычисления по всему отчёту

### Что относится к `report-row`

Сюда относятся:

- тип строки отчёта
- поля строки
- суммы строки
- курс валюты строки
- вычисления по строке
- отображение одной строки

### Практическое правило

Если вопрос звучит как:

- “что такое отчёт?” — это `report`
- “что такое одна запись в отчёте?” — это `report-row`
- “что пользователь делает со строкой?” — это уже `feature`

Пример:

- `ReportRow` как тип данных — `entity`
- `ReportTableRow` как отображение строки — `entity`
- создание или редактирование строки с конвертацией валюты — `feature`

## `@x` imports между entity

Для проекта фиксируется, что между `report` и `report-row` можно использовать `@x` импорт для типов.

Это нужно, чтобы:

- пощупать кросс-импорт между entity
- не тянуть внутренности одной entity напрямую в другую
- оставить контракт явным и ограниченным

Идея такая:

- обычные внутренние файлы entity не импортируются извне напрямую
- если другой entity нужен только тип или ограниченный публичный контракт, он берётся через `@x`

Примерно это будет выглядеть так:

```text
entities/
  report/
    model/
      types.ts
    @x/
      report-row.ts

  report-row/
    model/
      types.ts
    @x/
      report.ts
```

Пример по смыслу:

- `report` может экспортировать наружу тип отчёта через `@x/report-row`
- `report-row` может экспортировать наружу тип строки через `@x/report`

Важно:

- `@x` использовать только для ограниченных cross-entity контрактов
- не превращать `@x` в обход архитектуры
- если нужен UI или бизнес-логика другой entity, это уже повод пересмотреть границы, а не расширять `@x`

### Решение для текущего проекта

В рамках рефакторинга закрепляется следующее:

- в проекте будет две entity: `report` и `report-row`
- между ними разрешён `@x`-импорт для типов
- сценарии создания, редактирования, копирования, удаления и конвертации строки относятся к `features`

## Целевая структура для `report`, `report-row` и `features`

Ниже зафиксирована практическая структура, к которой можно двигаться во время рефакторинга.

```text
src/
  entities/
    report/
      model/
        types.ts
        store.ts
        selectors.ts
      ui/
        ReportDocument.vue
        ReportDocumentRow.vue
      lib/
        get-report-totals.ts
      @x/
        report-row.ts
      index.ts

    report-row/
      model/
        types.ts
      ui/
        ReportTableRow.vue
      lib/
        get-report-row-totals.ts
        map-report-row-to-form.ts
      @x/
        report.ts
      index.ts

  features/
    report-row-form/
      ui/
        ReportRowForm.vue
      model/
        types.ts
      lib/
        map-form-to-report-row.ts
      index.ts

    report-row-actions/
      ui/
        ReportTableRowButton.vue
      index.ts

    report-actions/
      ui/
        ReportActions.vue
      index.ts

    report-meta-form/
      ui/
        ReportMetaForm.vue
      index.ts

    report-script-toggle/
      ui/
        ReportScriptToggle.vue
      index.ts

  widgets/
    page-header/
      ui/
        PageHeader.vue
      index.ts

  pages/
    report-builder/
      ui/
        ReportBuilderPage.vue
        ReportTable.vue
      index.ts

    report-preview/
      ui/
        ReportPreviewPage.vue
      index.ts
```

## Что куда переносить из текущей структуры

### В `widgets`

- `src/app/AppHeader.vue`
  → `src/widgets/page-header/ui/PageHeader.vue`

### В `features`

- `src/widgets/create-form/ui/ReportRowCreateForm.vue`
  → `src/features/report-row-form/ui/ReportRowForm.vue`

- `src/widgets/report-builder/ui/ReportActions.vue`
  → `src/features/report-actions/ui/ReportActions.vue`

- `src/widgets/report-builder/ui/ReportBuilderMetaForm.vue`
  → `src/features/report-meta-form/ui/ReportMetaForm.vue`

- `src/widgets/report-preview/ui/ReportScriptToggle.vue`
  → `src/features/report-script-toggle/ui/ReportScriptToggle.vue`

- `src/widgets/report-builder/ui/ReportTableRowButton.vue`
  → `src/features/report-row-actions/ui/ReportTableRowButton.vue`

### В `entities/report`

- `src/widgets/report-document/ui/ReportDocument.vue`
  → `src/entities/report/ui/ReportDocument.vue`

- `src/widgets/report-document/ui/ReportDocumentRow.vue`
  → `src/entities/report/ui/ReportDocumentRow.vue`

### В `entities/report-row`

- `src/widgets/report-builder/ui/ReportTableRow.vue`
  → `src/entities/report-row/ui/ReportTableRow.vue`

### В `pages`

Следующий файл логичнее оставить в `pages`, а не в `entities`:

- `src/widgets/report-builder/ui/ReportTable.vue`
  → `src/pages/report-builder/ui/ReportTable.vue`

Причина:

- это не просто отображение одной сущности
- этот блок собирает сразу несколько сценариев: открыть модалку, создать строку, редактировать, копировать, удалить, очистить таблицу
- то есть он выступает как page composition block

Если позже захочется сделать его более доменно чистым, можно будет разделить:

- entity-таблицу
- feature-обработчики
- page-level composition

Но на текущем этапе перенос в `pages` будет самым понятным и безопасным.

## Как страницы должны собираться после рефакторинга

### `report-builder`

Страница сборки отчёта может собираться так:

- `PageHeader`
- `ReportActions`
- `ReportMetaForm`
- `ReportTable`

При этом:

- `ReportTable` использует `ReportRowForm`
- `ReportTable` использует `ReportTableRow`
- `ReportTableRow` использует `ReportTableRowButton`

### `report-preview`

Страница предпросмотра может собираться так:

- `PageHeader`
- `ReportScriptToggle`
- `ReportDocument`

## Что хранить в `@x`

Для начала в `@x` лучше хранить только типы.

Например:

```text
src/entities/report/@x/report-row.ts
src/entities/report-row/@x/report.ts
```

Смысл:

- `report` отдаёт наружу типы, которые могут понадобиться `report-row`
- `report-row` отдаёт наружу типы, которые могут понадобиться `report`

Примерно это могут быть:

- `Report`
- `ReportMeta`
- `ReportRow`
- `ReportRowAmounts`

Важно:

- не экспортировать через `@x` весь internal API
- не класть туда UI
- не класть туда feature-логику

## Минимальный пошаговый план переноса

Чтобы не запутаться, двигаться лучше так:

1. Создать `widgets/page-header` и перенести туда `AppHeader`
2. Создать `features/report-meta-form`
3. Создать `features/report-actions`
4. Создать `features/report-script-toggle`
5. Создать `features/report-row-form`
6. Создать `features/report-row-actions`
7. Создать `entities/report`
8. Создать `entities/report-row`
9. Перенести `ReportDocument` и `ReportDocumentRow` в `entities/report`
10. Перенести `ReportTableRow` в `entities/report-row`
11. Перенести `ReportTable` в `pages/report-builder`
12. После этого настроить `@x`-экспорты для типов между `report` и `report-row`

## Что такое `shared`

`shared` — это:

- универсальные UI-примитивы
- утилиты
- константы
- i18n
- типы без привязки к конкретной фиче или сущности

### Для текущего проекта

В `shared/ui` логично оставлять:

- `ButtonBase`
- `FieldBase`
- `ModalBase`
- `DividerBase`
- `TagBase`
- `ButtonGroup`
- `LinkBase`
- иконки

`shared/ui` — это не “всё переиспользуемое”, а именно UI без предметного смысла.

## Как разложить текущие компоненты по слоям

### Оставить в `shared/ui`

- все базовые кнопки, поля, модалки, теги, divider, dropdown, link
- иконки

### Перенести в `widgets`

- `AppHeader` → `widgets/page-header/ui/PageHeader.vue`

### Перенести в `features`

- `ReportActions`
- `ReportBuilderMetaForm`
- `ReportRowCreateForm`
- `ReportScriptToggle`
- возможно `ReportTableRowButton`

### Перенести в `entities/report`

- `ReportTable`
- `ReportTableRow`
- `ReportDocument`
- `ReportDocumentRow`

### Оставить в `pages`

- `ReportBuilderPage`
- `ReportPreviewPage`
- `NotFoundPage`

## Как должны идти зависимости слоёв

Сверху вниз можно, снизу вверх нельзя.

Нормально:

- `pages` → `widgets`, `features`, `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `features` → `entities`, `shared`
- `entities` → `shared`
- `shared` → только внутрь себя

Ненормально:

- `shared` → `entities`
- `entities` → `features`
- `features` → `pages`

## Как не путаться при разборе компонента

Задавать к каждому компоненту 4 вопроса:

1. Это маршрут?
   Если да, то `pages`.

2. Это законченный пользовательский сценарий?
   Если да, то `features`.

3. Это представление бизнес-сущности?
   Если да, то `entities`.

4. Это крупный композиционный блок страницы, но не маршрут и не сценарий?
   Если да, то `widgets`.

Если ни один пункт не подходит, обычно это `shared`.

## Почему сейчас возникла путаница

Проблема в том, что часть компонентов названа по экрану:

- `report-builder`
- `report-preview`
- `report-document`

Такие имена часто маскируют настоящий слой.

Внутри таких папок обычно смешиваются:

- page composition
- feature logic
- entity representation

Именно это сейчас и происходит в проекте.

## Практичный вывод для текущего проекта

Не нужно пытаться любой ценой наполнять `widgets`.

Для текущего проекта это нормально, если:

- `widgets` будет очень тонким слоем
- там останется только `PageHeader`
- основная предметная логика будет лежать в `features` и `entities`

Это лучше, чем складывать всё крупное в `widgets` просто потому, что оно крупное.

## Рекомендованный порядок рефакторинга

Не переделывать всё сразу. Идти по шагам:

1. Вынести `AppHeader` в `widgets/page-header`
2. Определить `entities/report`
3. Перенести туда:
   - `ReportTable`
   - `ReportTableRow`
   - `ReportDocument`
   - `ReportDocumentRow`
4. Перенести в `features`:
   - `ReportMetaForm`
   - `ReportRowCreateForm`
   - `ReportActions`
   - `ReportScriptToggle`
5. Оставить `pages` сборщиками этих блоков

## Короткая памятка

- `app` — инфраструктура приложения
- `pages` — маршруты
- `widgets` — крупные блоки страницы
- `features` — действия пользователя
- `entities` — бизнес-сущности
- `shared` — базовый UI и утилиты

Если страницы импортируют компонент напрямую, это не делает его `app`.
Если блок просто большой, это не делает его `widget`.
Если блок показывает сущность, это скорее `entity`.
Если блок реализует сценарий пользователя, это скорее `feature`.

---

1. Довести report entity
   Сейчас entities/report уже есть как модель, но стор всё ещё лежит в app/stores/metaDataStore.ts. По смыслу это уже не metaDataStore, а reportStore.

Следующий хороший шаг:

src/entities/report/model/store.ts

И туда перенести useMetaDataStore, возможно с переименованием:

useReportStore

Но чтобы не ломать всё резко, можно временно оставить старый файл как реэкспорт/алиас.

2. Вынести UI меты отчёта
   ReportBuilderMetaForm.vue работает с ReportMeta, значит по смыслу это не совсем widget. Но тут есть нюанс: это форма редактирования, то есть может быть не entities/report/ui, а будущая feature.

Я бы пока не торопилась. Лучше сначала вынести store, потому что граница модели важнее.

3. Разобраться с ReportRowCreateForm.vue
   Он сейчас лежит в widgets/create-form, но по смыслу это не widget. Это сценарий создания/редактирования строки.

Ему больше подходит:

src/features/report-row-form/ui/ReportRowCreateForm.vue

или точнее:

src/features/report-row/edit/ui/ReportRowForm.vue

Но его лучше переносить после store, потому что он сейчас тянет currencyStore, metaDataStore, расчёт валюты, initial value и payload.

4. Потом оставить widgets только композиционными
   В идеале:

widgets/report-builder
ReportActions
ReportTable

Но ReportTable должен быть именно сборщиком: открыть модалку, вызвать форму, добавить/изменить/удалить строку. А отображение строки уже правильно ушло в entities/report-row.

widgets/report-document/ReportDocument.vue пока нормальный widget: он собирает весь документ из report state + строк entity.

Мой следующий конкретный шаг: перенести useMetaDataStore в entities/report/model/store.ts и переименовать в useReportStore, а старый src/app/stores/metaDataStore.ts оставить совместимостью. Это даст
нормальную основу для дальнейшего переноса формы и действий.
