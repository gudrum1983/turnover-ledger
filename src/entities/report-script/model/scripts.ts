import type { I18nMessageKey } from '@/shared/i18n'
import type { ReportScript } from './types'

export const REPORT_SCRIPTS = ['srCyr', 'srLat'] as const

export const DEFAULT_REPORT_SCRIPT: ReportScript = 'srLat'

export const REPORT_SCRIPT_LABEL_KEY: Record<ReportScript, I18nMessageKey> = {
  srCyr: 'ui.reportPreviewScriptSwitcher.cyrillic',
  srLat: 'ui.reportPreviewScriptSwitcher.latin',
}

export const isReportScript = (value: unknown): value is ReportScript =>
  REPORT_SCRIPTS.some((script) => script === value)
