import { computed } from 'vue'
import { useReportStore } from '@/entities/report'
import { useLocale, type I18nLocale } from '@/shared/i18n'

const INTL_LOCALES: Record<I18nLocale, string> = {
  ru: 'ru',
  en: 'en',
  srLat: 'sr-Latn',
  srCyr: 'sr-Cyrl',
}

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
        //todo: откорректировать локализацию
        /*      const title = t('ui.reportYearSelect.year', { year })*/
        const title = year

        return {
          value: String(year),
          year,
          count,
          title,
          description,
          label: description,
        }
      }),
  )

  return { options }
}
