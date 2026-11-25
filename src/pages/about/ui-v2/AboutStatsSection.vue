<script setup lang="ts">
import { computed } from 'vue'
import { INTL_LOCALES, useLocale } from '@/shared/i18n'
import { formatDateForUi, type AppStats } from '@/shared/lib'
import { IconCalendar, IconDocuments, IconEye, IconRefresh } from '@/shared/ui-v2/icons'
import AboutStatCard from './AboutStatCard.vue'
import { getScriptShares } from './scriptShares'

const { stats } = defineProps<{
  /** Итоги анонимной статистики */
  stats: AppStats
}>()

const { t, locale } = useLocale()

const formatNumber = (value: number) => new Intl.NumberFormat(INTL_LOCALES[locale.value]).format(value)

const formatPercent = (value: number) =>
  new Intl.NumberFormat(INTL_LOCALES[locale.value], { style: 'percent', maximumFractionDigits: 0 }).format(value / 100)

// Разбивка по письму в процентах — только когда уже было что печатать.
const printBadges = computed(() => {
  const shares = getScriptShares(stats.printsByScript.srCyr ?? 0, stats.printsByScript.srLat ?? 0)
  if (!shares) return []
  return [
    t('ui.infoPage.statsCyrillicShort', { share: formatPercent(shares.cyrillic) }),
    t('ui.infoPage.statsLatinShort', { share: formatPercent(shares.latin) }),
  ]
})
</script>

<template>
  <section class="AboutStatsSection">
    <div class="AboutStatsSection-Header">
      <h2 class="u-typo-h2-l">{{ t('ui.infoPage.statsTitle') }}</h2>
      <p class="AboutStatsSection-Note u-typo-body-l">{{ t('ui.infoPage.statsNote') }}</p>
    </div>
    <div class="AboutStatsSection-Cards">
      <!-- Карточки парами: на узком экране пары встают одна под другой, сетка 2 × 2 -->
      <div class="AboutStatsSection-Group">
        <!-- Посещений нет в ответе, пока воркер не обновлён — тогда карточку не показываем -->
        <AboutStatCard
          v-if="stats.visits !== undefined"
          class="AboutStatsSection-Card"
          :icon="IconEye"
          :value="formatNumber(stats.visits)"
          :label="t('ui.infoPage.statsVisits')"
        />
        <AboutStatCard
          class="AboutStatsSection-Card"
          :icon="IconRefresh"
          :value="formatNumber(stats.conversions)"
          :label="t('ui.infoPage.statsConversions')"
        />
      </div>
      <div class="AboutStatsSection-Group">
        <!-- Отчёты — с разбивкой по письму -->
        <AboutStatCard
          class="AboutStatsSection-Card"
          :icon="IconDocuments"
          :value="formatNumber(stats.prints)"
          :label="t('ui.infoPage.statsPrints')"
          :badges="printBadges"
        />
        <!-- Дата начала подсчёта: «Старт статистики» -->
        <AboutStatCard
          v-if="stats.since"
          class="AboutStatsSection-Card"
          :icon="IconCalendar"
          :value="formatDateForUi(stats.since)"
          :label="t('ui.infoPage.statsSince')"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.AboutStatsSection {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.AboutStatsSection-Header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.AboutStatsSection-Note {
  color: var(--neutral-600);
}

// Две пары карточек поровну, карточки в паре поровну. На узком экране пары встают одна под другой,
// а если и пара не помещается — карточки в ней тоже переносятся, каждая на всю ширину.
.AboutStatsSection-Cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.AboutStatsSection-Group {
  display: flex;
  flex: 1 1 424px;
  flex-wrap: wrap;
  gap: 24px;
  min-width: 0;
}

// База 0 — в паре поровну; уже своего содержимого карточка не сжимается (min-width: auto),
// поэтому, когда двум не хватает места, вторая уходит на новую строку.
.AboutStatsSection-Card {
  flex: 1 1 0;
}
</style>
