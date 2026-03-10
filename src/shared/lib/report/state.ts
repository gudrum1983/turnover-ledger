import { FOOTER_FIELDS, HEADER_FIELDS, type FooterField, type HeaderField } from '../../constants/reportFields.ts'
import {
  REPORT_EXPORT_VERSION,
  type MoneyPart,
  type ReportExportFile,
  type ReportRow,
  type ReportState,
} from '../../types/report.ts'

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringRecord = <T extends string>(value: unknown, fields: readonly T[]): value is Record<T, string> => {
  if (!isObject(value)) return false

  return fields.every((field) => typeof value[field] === 'string')
}

const isMoneyPart = (value: unknown): value is MoneyPart => {
  if (!isObject(value)) return false
  if (typeof value.rsdCents !== 'number' || !Number.isFinite(value.rsdCents)) return false

  const foreignCents = value.foreignCents
  return foreignCents === undefined || foreignCents === null || typeof foreignCents === 'number'
}

const isReportRow = (value: unknown): value is ReportRow => {
  if (!isObject(value)) return false
  if (typeof value.id !== 'string') return false
  if (typeof value.date !== 'string') return false
  if (typeof value.description !== 'string') return false
  if (typeof value.currency !== 'string') return false

  const exchangeRate = value.exchangeRate
  if (exchangeRate !== undefined && exchangeRate !== null && typeof exchangeRate !== 'number') return false

  if (!isObject(value.amounts)) return false

  return isMoneyPart(value.amounts.goods) && isMoneyPart(value.amounts.services)
}

export function isReportState(value: unknown): value is ReportState {
  if (!isObject(value)) return false
  if (!isObject(value.meta)) return false
  if (!isStringRecord<HeaderField>(value.meta.header, HEADER_FIELDS)) return false
  if (!isStringRecord<FooterField>(value.meta.footer, FOOTER_FIELDS)) return false
  if (!Array.isArray(value.rows)) return false

  return value.rows.every(isReportRow)
}

export function cloneReportState(state: ReportState): ReportState {
  return {
    meta: {
      header: { ...state.meta.header },
      footer: { ...state.meta.footer },
    },
    rows: state.rows.map((row) => ({
      ...row,
      amounts: {
        goods: { ...row.amounts.goods },
        services: { ...row.amounts.services },
      },
    })),
  }
}

export function createReportExportFile(state: ReportState): ReportExportFile {
  return {
    version: REPORT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: cloneReportState(state),
  }
}

export function isReportExportFile(value: unknown): value is ReportExportFile {
  if (!isObject(value)) return false
  if (value.version !== REPORT_EXPORT_VERSION) return false
  if (typeof value.exportedAt !== 'string') return false

  return isReportState(value.data)
}

export function parseImportedReportState(value: unknown): ReportState | null {
  if (isReportState(value)) {
    return cloneReportState(value)
  }

  if (isReportExportFile(value)) {
    return cloneReportState(value.data)
  }

  return null
}
