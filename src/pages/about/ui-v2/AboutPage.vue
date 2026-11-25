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
import { useAppStats } from '@/shared/lib'
import AboutSection from './AboutSection.vue'
import AboutStatsSection from './AboutStatsSection.vue'
import { ABOUT_SECTIONS } from './aboutSections'

const { t } = useLocale()
const router = useRouter()

// Раздел «Статистика» — перед «Обратной связью», только когда итоги загрузились.
const { stats } = useAppStats()

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
      <template v-for="section in ABOUT_SECTIONS" :key="section.id">
        <AboutStatsSection v-if="section.id === 'contact' && stats" :stats="stats" />
        <AboutSection :title="t(section.titleKey)" :show-logo="section.showLogo" :items="section.items" />
      </template>
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
