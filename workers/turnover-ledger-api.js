// Cloudflare Worker turnover-ledger-api: CORS + proxy for kurs.resenje.org + анонимная статистика в D1.
// Пришёл на смену nbs-rates (nbs-rates.js): тот работает, пока все не перейдут на новую версию приложения.
//
// Прокси:
//  - https://<worker>/api/v1/currencies
//  - https://<worker>/api/v1/currencies/usd/conversions/123.45/2016-01-25
//  - https://<worker>/api/v1/rates/2016-01-25
// идут на https://kurs.resenje.org/api/v1/...
//
// Статистика (привязка D1 с именем DB, схема — workers/schema.sql):
//  - запросы /conversions/ считаются сами при проксировании;
//  - POST /stats/print — нажатие «Печать/PDF», тело — script=srCyr&locale=ru (письмо отчёта и язык интерфейса;
//    старые версии приложения шлют просто srLat / srCyr);
//  - POST /stats/visit — посещение: приложение шлёт его не чаще раза в день (UTC) с одного браузера;
//  - POST /stats/view  — открытие просмотра отчёта, не чаще раза в день с браузера, тело — язык интерфейса;
//  - GET  /stats       — итоги за всё время для страницы приложения. Языки интерфейса туда не входят:
//    они только для автора, смотреть в консоли D1 (запросы — в workers/schema.sql).
// Считаем только факт события: без IP, идентификаторов, сумм, дат и кодов валют.

const ORIGIN = 'https://kurs.resenje.org'

// События считаем только с адресов приложения — отсекает случайный мусор от ботов.
// Если приложение откроется с нового адреса (например, Vercel), его нужно добавить сюда.
const APP_ORIGINS = ['https://gudrum1983.github.io']

// Письмо отчёта для события печати: всё остальное записываем как пустую метку.
const PRINT_LABELS = ['srLat', 'srCyr']

// Языки интерфейса приложения: всё остальное записываем как пустую метку.
const LOCALE_LABELS = ['ru', 'en', 'srLat', 'srCyr']

const pickLabel = (value, allowed) => (allowed.includes(value) ? value : '')

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

// Если хочешь отключить кэш на конверсиях (чтобы не кешировать случайно разные суммы),
// можно оставить как есть или настроить правила ниже.
function getCacheConfig(pathname) {
  // Список валют может кешироваться дольше
  if (pathname === '/api/v1/currencies') {
    return { cacheEverything: true, cacheTtl: 3600 } // 1 час
  }

  // Конверсии лучше кешировать коротко или вообще не кешировать (на твой выбор)
  if (pathname.includes('/conversions/')) {
    return { cacheEverything: true, cacheTtl: 300 } // 5 минут
    // или: return { cacheEverything: false };
  }

  return { cacheEverything: true, cacheTtl: 600 } // дефолт 10 минут
}

function isAppRequest(request) {
  return APP_ORIGINS.includes(request.headers.get('Origin') ?? '')
}

function json(data, init = {}) {
  const headers = new Headers(init.headers)
  for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(data), { ...init, headers })
}

// +1 к счётчику события за сегодняшний день (UTC). Одна атомарная запись:
// одновременные запросы счёт не теряют. Ошибка базы не должна ломать ответ пользователю.
async function countEvent(env, event, label = '') {
  if (!env.DB) return
  const day = new Date().toISOString().slice(0, 10)
  try {
    await env.DB.prepare(
      `INSERT INTO stats (day, event, label, count) VALUES (?1, ?2, ?3, 1)
       ON CONFLICT (day, event, label) DO UPDATE SET count = count + 1`,
    )
      .bind(day, event, label)
      .run()
  } catch (error) {
    console.error('stats: не удалось записать событие', event, error)
  }
}

// Итоги за всё время: { conversions, prints, printsByScript: { srLat, srCyr }, visits, visitsToday, since }.
// visitsToday — посещения за сегодняшний день (UTC).
async function readStats(env) {
  const today = new Date().toISOString().slice(0, 10)
  const { results } = await env.DB.prepare(
    `SELECT event, label, SUM(count) AS total, MIN(day) AS since,
            SUM(CASE WHEN day = ?1 THEN count ELSE 0 END) AS today
     FROM stats GROUP BY event, label`,
  )
    .bind(today)
    .all()

  const stats = { conversions: 0, prints: 0, printsByScript: {}, visits: 0, visitsToday: 0, since: null }
  for (const row of results) {
    if (row.event === 'conversion') stats.conversions += row.total
    if (row.event === 'print') {
      stats.prints += row.total
      if (row.label) stats.printsByScript[row.label] = row.total
    }
    if (row.event === 'visit') {
      stats.visits += row.total
      stats.visitsToday += row.today
    }
    if (row.since && (!stats.since || row.since < stats.since)) stats.since = row.since
  }
  return stats
}

async function handleStats(request, env, ctx, url) {
  // Нажатие «Печать/PDF». Приложение шлёт его через navigator.sendBeacon и ответа не ждёт.
  if (url.pathname === '/stats/print' && request.method === 'POST') {
    if (isAppRequest(request)) {
      const body = (await request.text()).trim()
      // Новый формат — script=…&locale=…, старый — просто письмо отчёта.
      const params = body.includes('=') ? new URLSearchParams(body) : null
      const script = params ? params.get('script') : body
      ctx.waitUntil(countEvent(env, 'print', pickLabel(script, PRINT_LABELS)))
      // Язык при печати — отдельным событием, в итоги GET /stats не входит.
      if (params) ctx.waitUntil(countEvent(env, 'print-locale', pickLabel(params.get('locale'), LOCALE_LABELS)))
    }
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  // Посещение. Раз в день с браузера решает само приложение (дата последнего визита в localStorage),
  // воркер просто прибавляет +1 за сегодня.
  if (url.pathname === '/stats/visit' && request.method === 'POST') {
    if (isAppRequest(request)) ctx.waitUntil(countEvent(env, 'visit'))
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  // Открытие просмотра отчёта (раз в день с браузера) с языком интерфейса. В итоги GET /stats не входит.
  if (url.pathname === '/stats/view' && request.method === 'POST') {
    if (isAppRequest(request)) {
      const body = (await request.text()).trim()
      ctx.waitUntil(countEvent(env, 'view', pickLabel(body, LOCALE_LABELS)))
    }
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  // Итоги для страницы приложения. Кешируем в браузере на 5 минут — цифры чуть запаздывают,
  // зато база не читается на каждый заход.
  if (url.pathname === '/stats' && request.method === 'GET') {
    if (!env.DB) return json({ error: 'stats are not configured' }, { status: 503 })
    try {
      return json(await readStats(env), { headers: { 'Cache-Control': 'public, max-age=300' } })
    } catch (error) {
      console.error('stats: не удалось прочитать итоги', error)
      return json({ error: 'stats are unavailable' }, { status: 503 })
    }
  }

  return new Response('Not Found', { status: 404, headers: CORS_HEADERS })
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // 1) Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    // 2) Статистика — служебные роуты воркера, в апстрим не идут.
    if (url.pathname === '/stats' || url.pathname.startsWith('/stats/')) {
      return handleStats(request, env, ctx, url)
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS })
    }

    // 3) Берём path воркера как path апстрима
    const targetUrl = new URL(url.pathname + url.search, ORIGIN)

    // 4) Проксируем
    const upstreamRes = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cf: getCacheConfig(url.pathname),
    })

    // 5) Считаем успешный пересчёт суммы. waitUntil — запись в базу уже после ответа,
    // пользователь её не ждёт.
    if (url.pathname.includes('/conversions/') && upstreamRes.ok && isAppRequest(request)) {
      ctx.waitUntil(countEvent(env, 'conversion'))
    }

    // 6) Возвращаем с CORS
    const resHeaders = new Headers(upstreamRes.headers)
    for (const [k, v] of Object.entries(CORS_HEADERS)) resHeaders.set(k, v)

    // Иногда апстрим уже отдаёт content-type, но пусть будет гарантировано JSON:
    resHeaders.set('Content-Type', 'application/json; charset=utf-8')

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: resHeaders,
    })
  },
}
