<script setup lang="ts">
import { PageLayout } from '@/shared/ui-v2/page-layout'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { ROUTES } from '@/shared/constants/routes'
import { useLocale } from '@/shared/i18n'
import { PaperBlock } from '@/shared/ui-v2/paper-block'
import { AppFooter } from '@/widgets/app-footer'
import { AppHeader } from '@/widgets/app-header'
import { IconBack } from '@/shared/ui-v2/icons'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { INTL_LOCALES } from '@/shared/i18n'
import { formatDateForUi, useAppStats } from '@/shared/lib'
import AboutSection from './AboutSection.vue'
import { ABOUT_SECTIONS, type AboutSectionData } from './aboutSections'

const { t, locale } = useLocale()
const router = useRouter()

// Раздел «Статистика» — перед «Обратной связью», только когда итоги загрузились.
const { stats } = useAppStats()
const statsSection = computed<AboutSectionData | null>(() => {
  if (!stats.value) return null
  const { conversions, prints, printsByScript, since } = stats.value
  const formatNumber = (value: number) => new Intl.NumberFormat(INTL_LOCALES[locale.value]).format(value)

  return {
    id: 'stats',
    // С датой начала подсчёта — прямо в заголовке: «Статистика с 24.11.2026».
    titleKey: since ? 'ui.infoPage.statsTitleSince' : 'ui.infoPage.statsTitle',
    titleParams: since ? { date: formatDateForUi(since) } : undefined,
    items: [
      {
        id: 'statsConversions',
        parts: [
          { type: 'text', key: 'ui.infoPage.statsConversions' },
          { type: 'value', value: formatNumber(conversions) },
        ],
      },
      {
        id: 'statsPrints',
        parts: [
          { type: 'text', key: 'ui.infoPage.statsPrints' },
          { type: 'value', value: formatNumber(prints) },
          // Продолжение строки — по письму отчёта, когда уже было что печатать.
          ...(prints > 0
            ? ([
                { type: 'text', key: 'ui.infoPage.statsCyrillic' },
                { type: 'value', value: formatNumber(printsByScript.srCyr ?? 0) },
                { type: 'text', key: 'ui.infoPage.statsLatin' },
                { type: 'value', value: formatNumber(printsByScript.srLat ?? 0) },
              ] as const)
            : []),
        ],
      },
      { id: 'statsPrivacy', parts: [{ type: 'text', key: 'ui.infoPage.statsPrivacy' }] },
    ],
  }
})

const sections = computed(() => {
  if (!statsSection.value) return ABOUT_SECTIONS
  const contactIndex = ABOUT_SECTIONS.findIndex((section) => section.id === 'contact')
  return [...ABOUT_SECTIONS.slice(0, contactIndex), statsSection.value, ...ABOUT_SECTIONS.slice(contactIndex)]
})

function backToApp() {
  router.push({ name: ROUTES.reportBuilder.name })
}
</script>

<template>
  <PageLayout class="AboutPage" main-class="AboutPage-Main u-container">
    <template #header>
      <AppHeader
        :title="t('ui.appHeaderTitle')"
        subtitle="Учет доходов для паушальных налогоплательщиков"
        class="AboutPage-Header"
      >
        <template #controls>
          <LocaleSwitcher />
        </template>
        <template #actionButtons="{ size }">
          <div class="AboutPage-Actions">
            <ButtonWithIcon :size="size" :icon="IconBack" variant="accent" :onclick="backToApp">
              {{ t('ui.infoPage.backToApp') }}
            </ButtonWithIcon>
          </div>
        </template>
      </AppHeader>
    </template>

    <PaperBlock variant="info" class="AboutPage-Content">
      <AboutSection
        v-for="section in sections"
        :key="section.id"
        :title="t(section.titleKey, section.titleParams)"
        :show-logo="section.showLogo"
        :items="section.items"
      />
    </PaperBlock>

    <template #footer>
      <AppFooter />
    </template>
  </PageLayout>
</template>

<style scoped lang="scss">
.AboutPage {
  &-Actions {
    padding: 40px 0;
  }

  &-Header {
    margin-block-end: 16px;
  }

  &-Content {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}
</style>
