import { computed } from 'vue'
import { INTL_LOCALES, useLocale } from '@/shared/i18n'
import { formatMoney } from '@/shared/lib'
import { REPORT_FIRST_YEAR } from '@/shared/constants/app'

// Подписи годов и итог в окнах импорта и экспорта.
export function useYearLabels() {
  const { locale, t } = useLocale()
  const pluralRules = computed(() => new Intl.PluralRules(INTL_LOCALES[locale.value]))

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

  // «2026 - 16 записей (1.234.567,00 RSD)» — и в экспорте (из книги), и в импорте (из файла).
  function yearLabel(year: number, count: number, rsdCents: number) {
    return t('ui.dataTransferModal.yearRecords', {
      year,
      records: records(count),
      amount: formatMoney(rsdCents, { locale: locale.value }),
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

  return { yearLabel, skippedRowsText, importSummary }
}
