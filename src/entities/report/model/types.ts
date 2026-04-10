import type { FooterField, HeaderField } from './reportSchema'
import type { ReportRow } from '@/entities/report-row/@x/report'

export type ReportScript = 'srLat' | 'srCyr'

export type ReportMeta = {
  header: Record<HeaderField, string>
  footer: Record<FooterField, string>
}

export type ReportState = {
  meta: ReportMeta
  rows: ReportRow[]
}

export const REPORT_EXPORT_VERSION = 1 as const

export type ReportExportFile = {
  version: typeof REPORT_EXPORT_VERSION
  exportedAt: string
  data: ReportState
}
