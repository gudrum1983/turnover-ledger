// Код местной валюты: суммы в ней не пересчитываются.
export const LOCAL_CURRENCY_CODE = 'RSD'
// Воркер Cloudflare (workers/turnover-ledger-api.js): прокси курсов kurs.resenje.org и анонимная статистика в D1.
// Прежний воркер nbs-rates (workers/nbs-rates.js) работает, пока все не перейдут на новую версию приложения.
export const API_BASE_URL = 'https://turnover-ledger-api.gudrum1983.workers.dev'
export const EXCHANGE_RATE_API_URL = `${API_BASE_URL}/api/v1/currencies`
// Курсы всех валют на дату: <URL>/YYYY-MM-DD.
export const EXCHANGE_RATES_BY_DATE_API_URL = `${API_BASE_URL}/api/v1/rates`
/** Анонимная статистика: POST /stats/print, GET /stats (итоги) */
export const STATS_API_URL = `${API_BASE_URL}/stats`
export const EXCHANGE_RATE_SITE_URL = 'https://kurs.resenje.org/'
export const NBS_SITE_URL = 'https://www.nbs.rs/en'
export const SRB_GUIDE_KPO_URL = 'https://www.srb.guide/guides/business/tax/#%d0%ba%d0%bd%d0%b8%d0%b3%d0%b0-kpo'

// Первый год, доступный в выборе года отчёта (если нет записей раньше).
export const REPORT_FIRST_YEAR = 2020
