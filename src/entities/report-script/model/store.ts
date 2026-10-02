import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ReportScript } from './types'
import { DEFAULT_REPORT_SCRIPT, isReportScript } from './scripts'

const LOCAL_STORAGE_KEY = 'report-script'

export const useReportScriptStore = defineStore('report-script', () => {
  const savedScript = localStorage.getItem(LOCAL_STORAGE_KEY)
  const script = ref<ReportScript>(isReportScript(savedScript) ? savedScript : DEFAULT_REPORT_SCRIPT)

  function setScript(value: ReportScript) {
    script.value = value
  }

  watch(
    script,
    (value) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, value)
    },
    { immediate: true },
  )

  return { script, setScript }
})
