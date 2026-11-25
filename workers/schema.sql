-- Анонимная статистика приложения (D1 turnover-ledger-stats, привязка DB в воркере turnover-ledger-api.js).
-- Одна строка на событие в день: сколько раз оно случилось. Без IP, сумм, дат и кодов валют.
-- Выполнить один раз в консоли базы: Cloudflare → Storage & Databases → D1 → база → Console.

CREATE TABLE IF NOT EXISTS stats (
  day   TEXT    NOT NULL,             -- день в UTC, '2026-11-24'
  event TEXT    NOT NULL,             -- 'conversion' — пересчёт суммы, 'print' — «Печать/PDF», 'visit' — посещение (раз в день с браузера),
                                    -- 'view' — просмотр отчёта (раз в день с браузера), 'print-locale' — язык при печати
  label TEXT    NOT NULL DEFAULT '',  -- print — письмо отчёта: 'srLat' / 'srCyr'; view и print-locale — язык интерфейса: 'ru' / 'en' / 'srLat' / 'srCyr'
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event, label)
);

-- Полезные запросы:
--   Итог за всё время:   SELECT event, SUM(count) FROM stats GROUP BY event;
--   По месяцам:          SELECT substr(day, 1, 7) AS month, event, SUM(count) FROM stats GROUP BY month, event;
--   Печать по письму:    SELECT label, SUM(count) FROM stats WHERE event = 'print' GROUP BY label;
--   Язык при просмотре:  SELECT label, SUM(count) FROM stats WHERE event = 'view' GROUP BY label;
--   Язык при печати:     SELECT label, SUM(count) FROM stats WHERE event = 'print-locale' GROUP BY label;
