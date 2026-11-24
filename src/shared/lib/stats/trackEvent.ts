import { STATS_API_URL } from '@/shared/constants/app'

// Анонимная статистика: воркер считает только факт события (без IP, сумм и дат), см. workers/turnover-ledger-api.js.
// Шлём через sendBeacon: запрос уходит в фоне, не задерживает действие и доходит, даже если
// страница сразу закрывается. В разработке не шлём, чтобы не портить цифры.

// Одно нажатие — одно событие: повторы за это время (двойной клик) не отправляем.
const REPEAT_GUARD_MS = 5000
let lastPrintAt = 0

/** Нажатие «Печать/PDF»; label — письмо отчёта (srLat / srCyr) */
export function trackPrint(label: string, now: number = Date.now()): void {
  if (now - lastPrintAt < REPEAT_GUARD_MS) return
  lastPrintAt = now

  if (!import.meta.env.PROD || typeof navigator === 'undefined' || !navigator.sendBeacon) return

  try {
    navigator.sendBeacon(`${STATS_API_URL}/print`, label)
  } catch {
    // Статистика не должна мешать печати.
  }
}
