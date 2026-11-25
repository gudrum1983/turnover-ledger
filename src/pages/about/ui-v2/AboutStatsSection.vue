<script setup lang="ts">
import { computed } from 'vue'
import { INTL_LOCALES, useLocale } from '@/shared/i18n'
import { formatDateForUi, type AppStats } from '@/shared/lib'
import { IconDocuments, IconEye, IconRefresh } from '@/shared/ui-v2/icons'
import AboutStatCard from './AboutStatCard.vue'
import { getScriptShares } from './scriptShares'

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
      <p class="AboutStatsSection-Note u-typo-body-l">{{ note }}</p>
    </div>
    <div class="AboutStatsSection-Cards">
      <!-- Две короткие карточки — общей группой, чтобы и на телефоне стояли рядом -->
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
      <!-- Отчёты — широкая карточка (как две короткие) с разбивкой по письму -->
      <AboutStatCard
        class="AboutStatsSection-Card AboutStatsSection-Card_wide"
        :icon="IconDocuments"
        :value="formatNumber(stats.prints)"
        :label="t('ui.infoPage.statsPrints')"
        :badges="printBadges"
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

// Пара коротких карточек и широкая «Отчётов» — поровну; на узком экране «Отчётов» уходит вниз.
.AboutStatsSection-Cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.AboutStatsSection-Group {
  display: flex;
  flex: 1 1 400px;
  gap: 24px;
  min-width: 0;
}

.AboutStatsSection-Card {
  flex: 1 1 0;
  min-width: 0;
}

.AboutStatsSection-Card_wide {
  flex: 1 1 400px;
}
</style>
