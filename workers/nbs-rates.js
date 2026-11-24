// Cloudflare Worker nbs-rates (прежний): CORS + proxy for kurs.resenje.org
// Заменён воркером turnover-ledger-api (turnover-ledger-api.js). Удалить вместе с воркером в Cloudflare,
// когда старые версии приложения перестанут к нему обращаться.
// Examples:
//  - https://<worker>/api/v1/currencies
//  - https://<worker>/api/v1/currencies/usd/conversions/123.45/2016-01-25
//
// It proxies to:
//  - https://kurs.resenje.org/api/v1/currencies...
//

const ORIGIN = 'https://kurs.resenje.org'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

export default {
  async fetch(request) {
    const url = new URL(request.url)

    // 1) Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS })
    }

    // 2) Берём path воркера как path апстрима
    // Важно: если ты захочешь иметь служебные роуты воркера (например /health),
    // их нужно будет исключить здесь.
    const targetUrl = new URL(url.pathname + url.search, ORIGIN)

    // 3) Проксируем
    const upstreamRes = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cf: getCacheConfig(url.pathname),
    })

    // 4) Возвращаем с CORS
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
