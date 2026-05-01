# Testing Plan

Минимальный набор тестов для проекта `turnover-ledger`, с которого стоит начать.

## Приоритет

1. Юнит-тесты на расчеты и валидацию данных.
2. Тесты стора отчета.
3. Один browser/e2e regression-тест на ключевой пользовательский сценарий.

## 1. Юнит-тесты на чистые функции

Файлы:

- `src/entities/report-row/model/lib.ts`
- `src/entities/report/model/lib.ts`

Что проверить:

- `getRowTotals()` корректно суммирует `goods` и `services`.
- `getRowTotals()` трактует `undefined` и `null` как `0`.
- `getTableTotals()` корректно считает итог по нескольким строкам.
- `isReportState()` принимает валидную структуру и отклоняет битые данные.
- `parseImportedReportState()` умеет читать и `ReportState`, и export-файл.
- `cloneReportState()` делает глубокую копию без общих ссылок.

## 2. Тесты стора

Файл:

- `src/entities/report/model/store.ts`

Что проверить:

- `usedCurrencyCodes` собирает уникальные валюты в порядке появления.
- `hasUnsortedRows` правильно определяет несортированные строки.
- `hasRowsFromDifferentYears` правильно определяет строки из разных лет.
- `sortRowsByDate()` сортирует записи по дате.
- `replaceState()` и `exportState()` не теряют данные.
- `hydrateFromLocalStorage()` поднимает валидные данные из `localStorage`.
- `hydrateFromLocalStorage()` не падает на битом JSON.
- изменения в сторе сохраняются обратно в `localStorage`.

## 3. Минимальный regression/e2e сценарий

Файлы-кандидаты:

- `src/features/report-import-export/ui/ReportActions.vue`
- `src/widgets/report-preview-document/ui/ReportPreviewDocument.vue`

Сценарий:

- загрузить JSON-отчет;
- проверить, что строки и итог появились;
- перейти в preview;
- проверить, что итог и подписи рендерятся;
- отдельно прогнать кейс печатного preview со строками в диапазоне 6-9.

## Минимум, если делать совсем по шагам

Если времени мало, начинать в таком порядке:

- `src/entities/report/model/lib.ts`
- `src/entities/report-row/model/lib.ts`
- `src/entities/report/model/store.ts`
- один e2e тест на `import + preview`

## Что сделать следующим шагом

Завтра:

- выбрать структуру тестов (`*.spec.ts`);
- добавить базовый `vitest` setup для unit/store тестов;
- решить, пойдет ли печатный regression через `playwright` screenshot.
