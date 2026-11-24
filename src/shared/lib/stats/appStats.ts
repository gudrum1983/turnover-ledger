import { onMounted, readonly, ref } from 'vue'
import { STATS_API_URL } from '@/shared/constants/app'

/** Итоги анонимной статистики за всё время (GET /stats воркера turnover-ledger-api) */
export type AppStats = {
  /** Пересчётов сумм в RSD */
  conversions: number
  /** Нажатий «Печать/PDF» */
  prints: number
  /** Нажатий «Печать/PDF» по письму отчёта: srLat, srCyr */
  printsByScript: Record<string, number>
  /** Первый день подсчёта, YYYY-MM-DD (UTC), или null, если событий ещё не было */
  since: string | null
}

const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0

function isAppStats(value: unknown): value is AppStats {
  if (typeof value !== 'object' || value === null) return false
  const stats = value as Record<string, unknown>
  return (
    isCount(stats.conversions) &&
    isCount(stats.prints) &&
    typeof stats.printsByScript === 'object' &&
    stats.printsByScript !== null &&
    (stats.since === null || typeof stats.since === 'string')
  )
}

export async function fetchAppStats(): Promise<AppStats> {
  const response = await fetch(STATS_API_URL)
  if (!response.ok) throw new Error(`stats: ${response.status}`)

  const data: unknown = await response.json()
  if (!isAppStats(data)) throw new Error('stats: unexpected response')
  return data
}

/**
 * Статистика для страницы: загружается при монтировании компонента.
 * Пока грузится или если воркер недоступен — stats остаётся null, страница просто её не показывает.
 */
export function useAppStats() {
  const stats = ref<AppStats | null>(null)

  onMounted(async () => {
    try {
      stats.value = await fetchAppStats()
    } catch {
      // Статистика — не главное на странице: без неё раздел просто не показываем.
    }
  })

  return { stats: readonly(stats) }
}
