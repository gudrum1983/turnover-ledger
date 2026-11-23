import { computed } from 'vue'
import { INTL_LOCALES, useLocale } from '@/shared/i18n'
import { useViewport } from '@/shared/lib'
import { REPORT_FIRST_YEAR } from '@/shared/constants/app'
import type { ImportYearItem } from './importYears'

// Подписи годов в окнах импорта и экспорта.
// Экспорт: «2026 — 16 записей».
// Импорт: «2026 — в книге 2 записи, в файле 3», на мобильном коротко: «2026 — 2 в книге / 3 в файле».
export function useYearLabels() {
  const { locale, t } = useLocale()
  const viewport = useViewport()
  const pluralRules = computed(() => new Intl.PluralRules(INTL_LOCALES[locale.value]))
  const isMobile = computed(() => viewport.value === 'mobile')

  function pluralForm(count: number) {
    const category = pluralRules.value.select(count)
    return category === 'one' || category === 'few' || category === 'many' ? category : 'other'
  }

  function records(count: number) {
    return t(`ui.dataTransferModal.records.${pluralForm(count)}`, { count })
  }

  // «3 записи не будут импортированы: дата раньше 2020 года или позже сегодняшнего дня.»
  function skippedRowsText(count: number) {
    return t(`ui.dataTransferModal.importSkipped.${pluralForm(count)}`, { count, firstYear: REPORT_FIRST_YEAR })
  }

  function exportLabel(year: number, count: number) {
    return t('ui.dataTransferModal.yearRecords', { year, records: records(count) })
  }

  function importLabel({ year, current, inFile }: ImportYearItem) {
    if (isMobile.value) return t('ui.dataTransferModal.yearShort', { year, current, inFile })
    if (inFile === 0) return t('ui.dataTransferModal.yearInBookOnly', { year, records: records(current) })
    if (current === 0) return t('ui.dataTransferModal.yearInFileOnly', { year, records: records(inFile) })
    return t('ui.dataTransferModal.yearInBookAndFile', { year, inFile, records: records(current) })
  }

  const label = () => t('ui.dataTransferModal.meta')

  // Экспорт: заполненные — просто «Реквизиты», пустые — «Реквизиты - не заполнены».
  function metaExportLabel(filled: boolean) {
    if (filled) return label()
    return t('ui.dataTransferModal.metaExport', {
      label: label(),
      state: t('ui.dataTransferModal.metaNotFilled'),
    })
  }

  // Импорт — в том же формате, что и годы: «Реквизиты - в книге заполнены, в файле нет»,
  // на мобильном «Реквизиты - есть в книге / нет в файле».
  function metaImportLabel(inBook: boolean, inFile: boolean) {
    const none = t('ui.dataTransferModal.metaNone')
    const present = t(isMobile.value ? 'ui.dataTransferModal.metaPresent' : 'ui.dataTransferModal.metaFilled')
    return t(isMobile.value ? 'ui.dataTransferModal.metaImportShort' : 'ui.dataTransferModal.metaImport', {
      label: label(),
      book: inBook ? present : none,
      file: inFile ? present : none,
    })
  }

  // «записи за 2026 год», «записи за 2026 и 2025 годы», а если годов больше трёх — «записи за 7 лет».
  function yearsText(years: number[]) {
    if (years.length > 3) {
      return t(`ui.dataTransferModal.summary.yearsCount.${pluralForm(years.length)}`, { count: years.length })
    }
    const list = new Intl.ListFormat(INTL_LOCALES[locale.value], { type: 'conjunction' }).format(
      [...years].sort((left, right) => right - left).map(String),
    )
    return t(years.length === 1 ? 'ui.dataTransferModal.summary.yearsOne' : 'ui.dataTransferModal.summary.yearsMany', {
      years: list,
    })
  }

  /**
   * Итог импорта по отмеченным галочкам: что заменится, что добавится, остальное не изменится.
   * replacedYears — годы, которые уже есть в книге; addedYears — которых в книге нет;
   * meta — реквизиты: заменятся (в книге заполнены), добавятся (в книге пусто) или не трогаются.
   */
  function importSummary(replacedYears: number[], addedYears: number[], meta: 'replace' | 'add' | null) {
    const list = (items: string[]) =>
      new Intl.ListFormat(INTL_LOCALES[locale.value], { type: 'conjunction' }).format(items)
    const metaText = t('ui.dataTransferModal.summary.meta')
    const replaced = [
      ...(replacedYears.length ? [yearsText(replacedYears)] : []),
      ...(meta === 'replace' ? [metaText] : []),
    ]
    const added = [...(addedYears.length ? [yearsText(addedYears)] : []), ...(meta === 'add' ? [metaText] : [])]
    if (replaced.length === 0 && added.length === 0) return null
    return [
      ...(replaced.length ? [t('ui.dataTransferModal.summary.replace', { items: list(replaced) })] : []),
      ...(added.length ? [t('ui.dataTransferModal.summary.add', { items: list(added) })] : []),
      t('ui.dataTransferModal.summary.rest'),
    ].join(' ')
  }

  return { exportLabel, importLabel, skippedRowsText, metaExportLabel, metaImportLabel, importSummary }
}
