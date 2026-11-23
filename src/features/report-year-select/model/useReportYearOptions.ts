import { computed } from 'vue'
import { useReportStore } from '@/entities/report'
import { INTL_LOCALES, useLocale } from '@/shared/i18n'

export function useReportYearOptions() {
  const reportStore = useReportStore()
  const { locale, t } = useLocale()
  const pluralRules = computed(() => new Intl.PluralRules(INTL_LOCALES[locale.value]))

  const options = computed(() =>
    [...reportStore.yearSummaries]
      .sort((a, b) => b.year - a.year)
      .map(({ year, count }) => {
        const category = pluralRules.value.select(count)
        const form = category === 'one' || category === 'few' || category === 'many' ? category : 'other'
        const description =
          count === 0 ? t('ui.reportYearSelect.noRecords') : t(`ui.reportYearSelect.records.${form}`, { count })

        return {
          value: String(year),
          year,
          count,
          description,
          label: String(year),
        }
      }),
  )

  // Избранные: текущий год и годы, в которых есть хоть одна запись. Остальные — в свёрнутой части списка.
  const favorites = computed(() => {
    const currentYear = new Date().getFullYear()
    return options.value.filter(({ year, count }) => count > 0 || year === currentYear).map(({ value }) => value)
  })

  return { options, favorites }
}
