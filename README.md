# Turnover Ledger - Книга KPO (Paušal)

[Русская версия](#русская-версия) | [English version](#english-version)

## Русская версия

Приложение `Книга KPO (Paušal)` это вспомогательный инструмент для
предпринимателей на паушальном режиме налогообложения в Сербии.

Оно создано, чтобы упростить заполнение книги KPO. Основной сценарий использования это учёт доходов в иностранной валюте с
конвертацией в `RSD` при заполнении книги KPO.

Демо: https://gudrum1983.github.io/turnover-ledger/

### Что умеет приложение

- хранит данные налогоплательщика и ответственных лиц для отчёта;
- позволяет добавлять, редактировать, копировать, сортировать и удалять записи о доходах;
- пересчитывает суммы в RSD по курсу внешнего API;
- формирует печатный предпросмотр отчёта в сербской латинице и кириллице;
- поддерживает экспорт и импорт данных в `JSON`;
- сохраняет данные отчёта, язык интерфейса и служебный кэш в `localStorage`.

### Языки

- языки интерфейса: русский, английский, сербский;
- режимы отчёта: сербская латиница, сербская кириллица.

### Стек

- `Vue 3`
- `TypeScript`
- `Vite`
- `Pinia`
- `Vue Router`
- `Vue I18n`
- `Vitest`
- `Storybook`

### Локальный запуск

Требуемая версия Node.js: `^20.19.0` или `>=22.12.0`.

Установка зависимостей:

```bash
npm install
```

Запуск dev-сервера:

```bash
npm run dev
```

Сборка production-версии:

```bash
npm run build
```

Локальный предпросмотр production-сборки:

```bash
npm run preview
```

### Проверки качества

Проверка типов:

```bash
npm run type-check
```

Линтер:

```bash
npm run lint
```

Форматирование:

```bash
npm run format
```

### Тесты

Запуск unit-тестов:

```bash
npm run test
```

Watch-режим:

```bash
npm run test:watch
```

Визуальный интерфейс Vitest:

```bash
npm run test:ui
```

Отчёт по покрытию:

```bash
npm run test:coverage
```

Тесты, связанные со Storybook:

```bash
npm run test:storybook
```

### Storybook

Запуск локально:

```bash
npm run storybook
```

Сборка статической версии:

```bash
npm run build-storybook
```

### Структура проекта

```text
src/
  app/        инициализация приложения, роутер, сторы, глобальные стили
  entities/   доменные модели и бизнес-логика
  features/   пользовательские сценарии и фичи
  pages/      страницы маршрутов
  shared/     переиспользуемый UI, api, i18n, типы, утилиты
  widgets/    составные UI-блоки
public/       статические файлы
docs/         заметки и планы по проекту
```

### Важно

- приложение это вспомогательный инструмент, а не официальная бухгалтерская система;
- расчёты курсов зависят от внешнего API;
- перед использованием данных в реальной отчётности стоит сверять итоговые суммы с официальными источниками, например с
  данными Народного банка Сербии.

## English version

`Turnover Ledger` is the repository and project name. The application itself is presented in the UI as
`KPO Book (Paušal)`.

It is a helper tool for entrepreneurs on the Serbian lump-sum tax regime (`paušal`) designed to make KPO reporting
easier. The main workflow is income received in a foreign currency that needs to be converted to `RSD` directly while
filling in the report.

Live app: https://gudrum1983.github.io/turnover-ledger/

### Features

- stores taxpayer and responsible-person details for the report;
- lets you add, edit, copy, sort, and remove income rows;
- converts foreign-currency income to RSD using an external exchange-rate API;
- builds a printable report preview in Serbian Latin and Cyrillic;
- supports JSON export/import;
- keeps report data, locale, and service cache in browser `localStorage`.

### Languages

- UI: Russian, English, Serbian;
- report output: Serbian Latin, Serbian Cyrillic.

### Development

Required Node.js version: `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run preview
npm run storybook
npm run build-storybook
npm run type-check
npm run lint
npm run format
npm run test
npm run test:watch
npm run test:ui
npm run test:coverage
npm run test:storybook
```

### Notes

- this project is a helper tool, not an official accounting system;
- exchange-rate calculations depend on an external API;
- verify final values against official sources before using them in real reporting.
