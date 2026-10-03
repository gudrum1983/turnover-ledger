<script setup lang="ts">
import { LocaleSwitcher } from '@/features/locale-switcher'
import { CONTACT_EMAIL, EXCHANGE_RATE_SITE_URL, NBS_SITE_URL, SRB_GUIDE_KPO_URL } from '@/shared/constants/app'
import { ROUTES } from '@/shared/constants/routes'
import { useLocale } from '@/shared/i18n'
import { LinkEmail } from '@/shared/ui-v2/link-email'
import { LinkExternal } from '@/shared/ui-v2/link-external'
import { PaperBlock } from '@/shared/ui-v2/paper-block'
import { AppFooter } from '@/widgets/app-footer'
import { AppHeader } from '@/widgets/app-header'
import { IconBack } from '@/shared/ui-v2/icons'
import { ButtonWithIcon } from '@/shared/ui-v2/button-with-icon'
import { useRouter } from 'vue-router'
import { LogoBase } from '@/shared/ui-v2/logo-base'
import { PointBase } from '@/shared/ui-v2/point-base'

const { t } = useLocale()
const router = useRouter()

function backToApp() {
  router.push({ name: ROUTES.reportBuilder.name })
}
</script>

<template>
  <div class="AboutPage">
    <AppHeader
      :title="t('ui.appHeaderTitle')"
      subtitle="Учет доходов для паушальных налогоплательщиков"
      class="ReportBuilderPage_Header"
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

    <main class="AboutPage_Main u-container">
      <PaperBlock variant="info" class="AboutPage_Content">
        <section class="AboutPage_Intro">
          <div class="AboutPage-Logo">
            <LogoBase />
            <h2 class="u-typo-h2-l">{{ t('ui.infoPage.title') }}</h2>
          </div>

          <div class="AboutPage-Introlist">
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">{{ t('ui.infoPage.introText') }}</p>
            </div>

            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.introNote') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.introFeatures') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.introLanguages') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.introGuideBeforeLink') }}
                <LinkExternal :href="SRB_GUIDE_KPO_URL" size="md">{{ t('ui.infoPage.guideLinkText') }}</LinkExternal>
                {{ t('ui.infoPage.introGuideAfterLink') }}
              </p>
            </div>
          </div>
        </section>

        <section class="AboutPage_Section">
          <h3 class="u-typo-h2-l">{{ t('ui.infoPage.storageTitle') }}</h3>
          <div class="AboutPage-Introlist">
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.storageText') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.storageNote') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.storageBackupNote') }}
              </p>
            </div>
          </div>
        </section>

        <section class="AboutPage_Section">
          <h3 class="u-typo-h2-l">{{ t('ui.infoPage.conversionTitle') }}</h3>
          <div class="AboutPage-Introlist">
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.conversionTextBeforeLink') }}
                <LinkExternal :href="EXCHANGE_RATE_SITE_URL" size="md">{{ t('ui.infoPage.apiLinkText') }}</LinkExternal>
                {{ t('ui.infoPage.conversionTextAfterLink') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.conversionNote') }}
              </p>
            </div>
          </div>
        </section>

        <section class="AboutPage_Section">
          <h3 class="u-typo-h2-l">{{ t('ui.infoPage.disclaimerTitle') }}</h3>
          <div class="AboutPage-Introlist">
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.disclaimerText') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.disclaimerNote') }}
              </p>
            </div>
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.disclaimerRecommendationBeforeLink') }}
                <LinkExternal :href="NBS_SITE_URL" size="md">{{ t('ui.infoPage.bankLinkText') }}</LinkExternal>
                {{ t('ui.infoPage.disclaimerRecommendationAfterLink') }}
              </p>
            </div>
          </div>
        </section>

        <section class="AboutPage_Section">
          <h3 class="u-typo-h2-l">{{ t('ui.infoPage.contactTitle') }}</h3>
          <div class="AboutPage-Introlist">
            <div class="AboutPage-Point">
              <PointBase class="AboutPage-Marker" />
              <p class="u-typo-body-l">
                {{ t('ui.infoPage.contactText') }} <LinkEmail :email="CONTACT_EMAIL" size="md" />
              </p>
            </div>
          </div>
        </section>
      </PaperBlock>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &-Point {
    display: flex;
    gap: 10px;
  }

  &-Marker {
    margin: 8px;
    min-height: 4px;
    min-width: 4px;
    flex-shrink: 0;
  }

  &-Logo {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &-Introlist {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-Actions {
    padding: 40px 0;
  }

  &_Header {
    margin-block-end: 16px;
  }

  &_Main {
    flex: 1;
  }

  &_Content {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &_Section,
  &_Intro {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>
