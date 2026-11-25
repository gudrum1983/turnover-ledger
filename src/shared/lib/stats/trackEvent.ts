import { STATS_API_URL } from '@/shared/constants/app'

// Анонимная статистика: воркер считает только факт события (без IP, сумм и дат), см. workers/turnover-ledger-api.js.
// Шлём через sendBeacon: запрос уходит в фоне, не задерживает действие и доходит, даже если
// страница сразу закрывается. В разработке не шлём, чтобы не портить цифры.

function sendStatsEvent(path: string, body?: string): void {
  if (!import.meta.env.PROD || typeof navigator === 'undefined' || !navigator.sendBeacon) return

  try {
    navigator.sendBeacon(`${STATS_API_URL}/${path}`, body)
  } catch {
    // Статистика не должна мешать работе приложения.
  }
}

// Одно нажатие — одно событие: повторы за это время (двойной клик) не отправляем.
const REPEAT_GUARD_MS = 5000
let lastPrintAt = 0

/**
 * Тело события печати: письмо отчёта (srLat / srCyr) и язык интерфейса.
 * Язык в публичную статистику не попадает — только в базу.
 */
export function buildPrintBody(script: string, locale: string): string {
  return new URLSearchParams({ script, locale }).toString()
}

/** Нажатие «Печать/PDF» */
export function trackPrint(script: string, locale: string, now: number = Date.now()): void {
  if (now - lastPrintAt < REPEAT_GUARD_MS) return
  lastPrintAt = now

  sendStatsEvent('print', buildPrintBody(script, locale))
}

const VISIT_DAY_STORAGE_KEY = 'statsLastVisitDay'
const VIEW_DAY_STORAGE_KEY = 'statsLastViewDay'

/**
 * Отмечает событие за сегодня (день по UTC, как у воркера) под ключом key.
 * Возвращает true, если сегодня это первое такое событие с этого браузера и его нужно отправить.
 * Хранится только дата — никаких идентификаторов.
 */
export function markEventDay(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  key: string,
  now: Date = new Date(),
): boolean {
  const today = now.toISOString().slice(0, 10)
  try {
    if (storage.getItem(key) === today) return false
    storage.setItem(key, today)
    return true
  } catch {
    // localStorage недоступен (приватный режим, запрет) — не считаем, чтобы не слать на каждый заход.
    return false
  }
}

function trackOncePerDay(key: string, path: string, body?: string): void {
  if (!import.meta.env.PROD || typeof localStorage === 'undefined') return
  if (!markEventDay(localStorage, key)) return
  sendStatsEvent(path, body)
}

/** Посещение приложения: не чаще раза в день с одного браузера */
export function trackVisit(): void {
  trackOncePerDay(VISIT_DAY_STORAGE_KEY, 'visit')
}

/**
 * Открытие просмотра отчёта: не чаще раза в день с одного браузера.
 * Передаём язык интерфейса — он нужен только автору, в публичную статистику не попадает.
 */
export function trackView(locale: string): void {
  trackOncePerDay(VIEW_DAY_STORAGE_KEY, 'view', locale)
}
