<script setup lang="ts">
import { computed } from 'vue'
import { INTL_LOCALES, useLocale } from '@/shared/i18n'
import { formatDateForUi, type AppStats } from '@/shared/lib'
import { IconDocuments, IconRefresh } from '@/shared/ui-v2/icons'
import AboutStatCard from './AboutStatCard.vue'

const { stats } = defineProps<{
  /** Итоги анонимной статистики */
  stats: AppStats
}>()

const { t, locale } = useLocale()

const formatNumber = (value: number) => new Intl.NumberFormat(INTL_LOCALES[locale.value]).format(value)

// Дата начала подсчёта — в серой подписи под заголовком: «…анонимно с 24.11.2026: …».
const note = computed(() =>
  stats.since ? t('ui.infoPage.statsNoteSince', { date: formatDateForUi(stats.since) }) : t('ui.infoPage.statsNote'),
)

// Разбивку по письму показываем, только когда уже было что печатать.
const printBadges = computed(() =>
  stats.prints > 0
    ? [
        t('ui.infoPage.statsCyrillicShort', { count: formatNumber(stats.printsByScript.srCyr ?? 0) }),
        t('ui.infoPage.statsLatinShort', { count: formatNumber(stats.printsByScript.srLat ?? 0) }),
      ]
    : [],
)
</script>

<template>
  <section class="AboutStatsSection">
    <div class="AboutStatsSection-Header">
      <h2 class="u-typo-h2-l">{{ t('ui.infoPage.statsTitle') }}</h2>
      <p class="AboutStatsSection-Note u-typo-body-l">{{ note }}</p>
    </div>
    <div class="AboutStatsSection-Cards">
      <AboutStatCard
        :icon="IconDocuments"
        :value="formatNumber(stats.prints)"
        :label="t('ui.infoPage.statsPrints')"
        :badges="printBadges"
      />
      <AboutStatCard
        :icon="IconRefresh"
        :value="formatNumber(stats.conversions)"
        :label="t('ui.infoPage.statsConversions')"
      />
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

// На узком экране карточки переносятся и встают одна под другой.
.AboutStatsSection-Cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
</style>
