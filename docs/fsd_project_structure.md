# FSD: текущая структура проекта

Этот файл описывает не абстрактный FSD, а текущую структуру именно этого проекта после рефакторинга.

См. также общий конспект по FSD: [fsd.md](./fsd.md)

## Слои

### `app`

Код запуска приложения и глобальной конфигурации.

- `src/app/main.ts` — точка входа
- `src/app/App.vue` — корневой компонент
- `src/app/router/` — роутинг
- `src/app/styles/` — глобальные стили

### `pages`

Полные страницы. Страница должна в основном собирать экран из `widgets` и `features`, а не держать внутри бизнес-сценарий.

- `src/pages/report-builder/`
  - `ui/ReportBuilderPage.vue`
  - `index.ts`
- `src/pages/report-preview/`
  - `ui/ReportPreviewPage.vue`
  - `index.ts`
- `src/pages/not-found/`
  - `ui/NotFoundPage.vue`
  - `index.ts`

### `widgets`

Крупные композиционные блоки интерфейса. Обычно это большой кусок страницы, но не отдельный пользовательский сценарий.

- `src/widgets/app-header/`
  - `ui/AppHeader.vue`
  - `index.ts`
- `src/widgets/report-rows-table/`
  - `ui/ReportRowsTable.vue`
  - `index.ts`
- `src/widgets/report-preview-document/`
  - `ui/ReportPreviewDocument.vue`
  - `index.ts`

### `features`

Пользовательские сценарии и прикладные действия.

- `src/features/locale-switcher/`
  - `ui/LocaleSwitcher.vue`
  - переключение локали интерфейса
- `src/features/report-import-export/`
  - `ui/ReportImportExportActions.vue`
  - экспорт и импорт состояния отчета
- `src/features/report-meta-edit/`
  - `ui/ReportMetaEditForm.vue`
  - редактирование метаданных отчета
- `src/features/report-row-edit/`
  - `ui/ReportRowEditForm.vue`
  - форма создания/редактирования строки отчета
- `src/features/report-row-manage/`
  - `ui/ReportRowManage.vue`
  - orchestration для строк: add/edit/copy/remove/clear, modal state
- `src/features/report-script-switch/`
  - `ui/ReportScriptSwitch.vue`
  - переключение скрипта документа `srLat/srCyr`

### `entities`

Бизнес-сущности проекта и их модель.

- `src/entities/report/`
  - `model/store.ts` — store отчета
  - `model/types.ts` — типы отчета
  - `model/fields.ts` — списки полей и field types
  - `model/labels.ts` — label helpers
  - `model/lib.ts` — totals, import/export, validation helpers
  - `model/useReportScript.ts` — состояние скрипта документа
  - `index.ts`
- `src/entities/report-row/`
  - `model/types.ts` — тип строки
  - `model/lib.ts` — totals по строке
  - `ui/ReportTableRow.vue`
  - `ui/ReportDocumentRow.vue`
  - `@x/report.ts` — cross-entity contract для `report`
  - `index.ts`
- `src/entities/currency/`
  - `api/currencies.ts` — запросы по валютам/конвертации
  - `model/currencyStore.ts` — store валют
  - `model/types.ts` — типы ответа API и валют
  - `index.ts`

### `shared`

Переиспользуемая инфраструктура, не привязанная к конкретному сценарию.

- `src/shared/ui/` — базовые UI-компоненты
- `src/shared/lib/` — утилиты
- `src/shared/i18n/` — локализация
- `src/shared/constants/` — общие константы
- `src/shared/types/` — общие value object / типы, например `CurrencyCode`

## Что где хранить

### Если это страница

Класть в `pages`.

Признаки:

- это route-level экран
- собирает несколько `widgets/features`
- не должна держать много прикладной логики

### Если это крупный блок страницы

Класть в `widgets`.

Признаки:

- большой композиционный кусок интерфейса
- может использовать `entities` и `shared`
- обычно не является отдельным user action

Примеры:

- `AppHeader`
- `ReportRowsTable`
- `ReportPreviewDocument`

### Если это действие пользователя или прикладной сценарий

Класть в `features`.

Признаки:

- пользователь что-то делает
- есть orchestration
- есть сценарная логика
- может управлять modal state, submit, import/export, переключением режимов

Примеры:

- import/export отчета
- редактирование метаданных
- управление строками отчета
- переключение скрипта документа

### Если это бизнес-сущность

Класть в `entities`.

Признаки:

- доменная модель
- store
- доменные типы
- расчеты и helpers уровня сущности

Примеры:

- `report`
- `report-row`
- `currency`

### Если это просто общий инструмент

Класть в `shared`.

Примеры:

- base button
- modal
- date formatting
- money helpers
- общие типы

## Сегменты

В проекте сейчас используются в основном такие сегменты:

- `ui` — Vue-компоненты
- `model` — store, типы, доменная логика
- `api` — запросы к внешним данным
- `lib` — локальные утилиты слайса
- `@x` — cross-entity контракт
- `index.ts` — public API слайса

## Правила, чтобы структура не расползалась

### 1. Страница не должна становиться feature

Если в `page` начинает жить логика вида:

- открыть modal
- создать/отредактировать/удалить
- импортировать/экспортировать
- оркестрировать store и form

значит это уже кандидат в `feature`.

### 2. Импортировать слайсы только через `index.ts`

Хорошо:

```ts
import { ReportRowManage } from '@/features/report-row-manage'
import { AppHeader } from '@/widgets/app-header'
```

Плохо:

```ts
import ReportRowManage from '@/features/report-row-manage/ui/ReportRowManage.vue'
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue'
```

Исключение:

- внутренние импорты внутри самого слайса

### 3. Не делать `parts` серой зоной

Если внутри `pages` или `widgets` появляется папка `parts`, это сигнал проверить:

- это просто внутренний маленький UI-фрагмент
- или уже отдельный `widget`
- или уже `feature`

`parts` не должен становиться заменой нормальных слоев.

### 4. `widget` не обязан быть переиспользуемым

Если блок используется только на одной странице, это все равно может быть `widget`, если он:

- крупный
- самостоятельный
- композиционный

### 5. В `features` не тянуть лишний store, если можно передать данные снаружи

Если форма или UI-компоненту нужен только:

- `defaultCurrency`
- `favoriteCurrencyCodes`
- `initialValue`

лучше передать это через props из orchestration-слоя, чем тащить лишнюю зависимость на другой store.

### 6. Простые общие типы хранить в `shared/types`

Если тип не является полноценной доменной сущностью, а просто value object, лучше держать его в `shared/types`.

Пример:

- `CurrencyCode`

### 7. Cross-entity связи делать явно

Если одна entity зависит от другой, не прятать это случайным импортом во внутренности.

Использовать:

- либо `shared/types`, если это общий примитив
- либо `@x`, если это осознанный cross-entity контракт

### 8. Слайс должен иметь одну понятную ответственность

Если слайс делает слишком много разного, это повод разделить его.

Хорошо:

- `report-row-edit`
- `report-row-manage`

Плохо:

- один слайс и для формы, и для таблицы, и для orchestration, и для экспорта

## Короткая памятка по текущему направлению зависимостей

Нормально:

- `pages` -> `widgets`, `features`, `entities`, `shared`
- `widgets` -> `features?` лучше избегать, обычно `entities`, `shared`
- `features` -> `entities`, `shared`
- `entities` -> `shared`

Нельзя:

- `shared` -> `entities/features/widgets/pages`
- `entities` -> `features/widgets/pages`
- `features` -> `pages`

## Практическое правило перед созданием нового файла

Сначала ответить на вопрос:

1. Это экран?
2. Это большой блок экрана?
3. Это пользовательское действие/сценарий?
4. Это бизнес-сущность?
5. Это общий инструмент?

По ответу:

- экран -> `pages`
- блок -> `widgets`
- сценарий -> `features`
- сущность -> `entities`
- общее -> `shared`
