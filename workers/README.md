# Воркеры Cloudflare

Код воркеров Cloudflare, к которым обращается приложение. **В сборку приложения не входит** — Vite и TypeScript эти
файлы не видят. Хранится здесь для истории и как резервная копия: сам воркер живёт в Cloudflare, и деплоится
вручную — копированием кода в редактор воркера.

Если меняешь код воркера, обнови файл здесь и задеплой его в Cloudflare — иначе они разойдутся.

| Файл                     | Воркер в Cloudflare   | Что делает                                                        |
| ------------------------ | --------------------- | ----------------------------------------------------------------- |
| `turnover-ledger-api.js` | `turnover-ledger-api` | Прокси курсов kurs.resenje.org (CORS) и анонимная статистика в D1 |
| `schema.sql`             | база D1               | Таблица статистики `stats` в базе `turnover-ledger-stats`         |
| `nbs-rates.js`           | `nbs-rates`           | Прежний прокси курсов без статистики                              |

Адрес воркера задан в приложении одной константой: `API_BASE_URL` в `src/shared/constants/app.ts`.

## turnover-ledger-api

- `https://turnover-ledger-api.gudrum1983.workers.dev/api/v1/...` — прокси на `https://kurs.resenje.org/api/v1/...`.
- `POST /stats/print` — нажатие «Печать/PDF», тело запроса — письмо отчёта (`srLat` / `srCyr`).
  Приложение шлёт его через `navigator.sendBeacon` (`src/shared/lib/stats/trackEvent.ts`), в разработке — не шлёт.
- `GET /stats` — итоги за всё время: `{ conversions, prints, printsByScript, since }`. Кешируется в браузере на 5 минут.
- Пересчёты сумм (`/conversions/`) считаются сами при проксировании.

Считаются только события с адреса приложения (заголовок `Origin` из `APP_ORIGINS`). Превью
(`/turnover-ledger-preview/`) живёт на том же адресе и тоже попадает в статистику — для наших целей это не важно.
Хранится только факт события за день (UTC): без IP, сумм, дат и кодов валют.

### Настройка с нуля

1. **Воркер**: Workers & Pages → Create → Start with Hello World, имя `turnover-ledger-api`
   (Cloudflare Access не включать). Edit code → вставить `turnover-ledger-api.js` → Deploy.
2. **База**: Storage & Databases → D1 → Create, имя `turnover-ledger-stats`, расположение — автоматически.
   В Console базы выполнить `CREATE TABLE …` из `schema.sql` (консоль однострочная — без комментариев).
3. **Привязка**: воркер → Settings → Bindings → Add binding → D1 database, Variable name **`DB`**,
   база `turnover-ledger-stats`.
4. **Проверка**: `…/api/v1/currencies` отдаёт список валют, `…/stats` — `{"conversions":0,"prints":0,…}`.

Если `/stats` отвечает `stats are not configured` — нет привязки `DB`; `stats are unavailable` — нет таблицы.

## nbs-rates

Прежний воркер (`https://nbs-rates.gudrum1983.workers.dev`), только прокси курсов. Приложение перешло на
`turnover-ledger-api`; старый оставлен, пока у кого-то открыта прежняя версия страницы. Когда в его метриках
запросов не останется — удалить воркер в Cloudflare и этот файл.
