import { computed, ref, watch } from 'vue'
import type { ReportScript } from '@/entities/report'

const DEFAULT_STORAGE_KEY = 'report-script'
const REPORT_SCRIPTS: ReportScript[] = ['srLat', 'srCyr']

type UseReportScriptOptions = {
  defaultScript?: ReportScript
  storageKey?: string
  syncStorage?: boolean
}

const isReportScript = (value: unknown): value is ReportScript =>
  typeof value === 'string' && REPORT_SCRIPTS.includes(value as ReportScript)

export function useReportScript(options: UseReportScriptOptions = {}) {
  const { defaultScript = 'srLat', storageKey = DEFAULT_STORAGE_KEY, syncStorage = true } = options

  const storageScript = (() => {
    if (!syncStorage) return null
    const value = localStorage.getItem(storageKey)
    return isReportScript(value) ? value : null
  })()

  const script = ref<ReportScript>(storageScript ?? defaultScript)

  const setScript = (next: ReportScript) => {
    if (script.value === next) return
    script.value = next
  }

  watch(
    script,
    (value) => {
      if (syncStorage) {
        localStorage.setItem(storageKey, value)
      }
    },
    { immediate: true },
  )

  return {
    script: computed<ReportScript>({
      get: () => script.value,
      set: (value) => setScript(value),
    }),
    setScript,
    isReportScript,
  }
}
