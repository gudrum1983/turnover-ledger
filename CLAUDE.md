# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Книга KPO (Paušal)" — a client-only Vue 3 + TypeScript + Vite SPA that helps Serbian lump-sum (paušal) entrepreneurs fill in the KPO book: income rows in foreign currency are converted to RSD via an external exchange-rate API, and a printable report is rendered in Serbian Latin or Cyrillic. There is no backend; all state lives in `localStorage`. Commit messages, comments and docs are written in Russian (conventional-commit prefixes: `feat:`, `fix:`, `refactor:`).

## Commands

Node `^20.19.0 || >=22.12.0`.

```bash
npm run dev              # Vite dev server
npm run build            # type-check + vite build (in parallel)
npm run type-check       # vue-tsc --build
npm run lint             # eslint --fix --cache
npm run format           # prettier on src/
npm run test             # unit tests (vitest.unit.config.ts, node env, src/**/*.spec.ts)
npm run test:watch
npm run storybook        # Storybook on :6006
npm run test:storybook   # story tests in headless Chromium via Playwright (vite.config.ts test project)
```

Run a single unit test file / test name:

```bash
npx vitest run --config vitest.unit.config.ts src/entities/report/model/store.spec.ts
npx vitest run --config vitest.unit.config.ts -t "getRowTotals"
```

Always pass `--config vitest.unit.config.ts` for unit tests — plain `vitest` picks up `vite.config.ts`, which only defines the Storybook browser project. Pre-commit hook runs `lint-staged` (eslint + prettier).

Deploy: GitHub Pages on push to `main` (`.github/workflows/deploy.yml`); production `base` is `/turnover-ledger/` unless `VERCEL=1`. `develop` is the integration branch.

## Architecture

Feature-Sliced Design under `src/`: `app → pages → widgets → features → entities → shared`. A layer may only import from layers below it, and only through a slice's public `index.ts` (path alias `@` = `src`).

- **Cross-entity imports** go through `@x` files (e.g. `entities/report-row/@x/report.ts` is the API that `entities/report` may consume). Don't import another entity's internals directly; add an `@x` re-export instead.
- **Entities** hold Pinia stores and pure domain logic:
  - `report` — the main store (`model/store.ts`): report state per year, active year, meta, rows; import/export (`createReportExportFile`, `parseImportedReportState`, versioned by `REPORT_EXPORT_VERSION`); validation.
  - `report-row` — row type and totals math.
  - `report-script` — Latin/Cyrillic report mode and the report label dictionaries.
  - `currency` — exchange-rate API client (`EXCHANGE_RATE_API_URL` in `shared/constants/app.ts`) and a cached currency store.
- **Persistence**: stores expose `hydrateFromLocalStorage()`, called explicitly in `app/main.ts` before mount (keys: `reportState`, `reportActiveYear`, `currenciesState`, `report-script`, locale). Corrupt stored data is silently ignored.
- **Routing**: hash history (`app/router/index.ts`), route names/paths in `shared/constants/routes.ts`, pages lazy-loaded.

### UI v1 → v2 migration (in progress)

Most slices have both `ui/` (legacy) and `ui-v2/` (new design), and `shared/` has both `ui/` and `ui-v2/` component kits. Current work ports components to `ui-v2`; a slice's `index.ts` decides which version is exported (e.g. `pages/report-builder/index.ts` exports `ui-v2/ReportBuilderPage.vue`). When migrating, build the new component in `ui-v2/` with the `shared/ui-v2` kit, switch the export in `index.ts`, and leave the legacy `ui/` in place unless asked to remove it. Each `shared/ui-v2/<component>/` folder contains the `.vue`, an `index.ts`, optional `types.ts`, and a `*.stories.ts`.

### Styling conventions

- **Class naming** (`docs/naming_class_bem.md`): React-style BEM — `BlockName-ElemName_modName_modVal`. Block = component name in PascalCase; the component root always has the block class; elements separated by `-`, modifiers by `_` in camelCase; modifier classes are added alongside the base class. Utilities use `u-kebab-case` (`u-uppercase`, `u-typo-button-m`).
- New styles are SCSS: tokens in `src/app/styles/tokens/`, utilities (incl. typography `u-typo-*`) in `src/app/styles/utilities/`, aggregated by `styles/index.scss`. `typography.css` / `variables.css` are legacy, kept for v1 UI.
- **Token naming** (`docs/naming_css_var.md`): `[category]-[type]-[item]-[subitem]-[state]`, e.g. `$color-background-button-primary-hover`.
- ESLint enforces `vue/multi-word-component-names`.

### i18n

UI locales: `ru`, `en`, `srLat`, `srCyr` (`shared/i18n`). Russian (`locales/ru/`) is the source schema: other locales are type-checked against its shape, so a new key must be added to `ru` first and then to every other locale, or `type-check` fails. Report-document labels (Latin/Cyrillic) live separately in `entities/report-script/model/labels`.
