<script setup lang="ts">
import { LocaleSwitcher } from '@/features/locale-switcher'
import { CONTACT_EMAIL, EXCHANGE_RATE_SITE_URL, NBS_SITE_URL, SRB_GUIDE_KPO_URL } from '@/shared/constants/app'
import { ROUTES } from '@/shared/constants/routes'
import { useLocale } from '@/shared/i18n'
import { LinkBase } from '@/shared/ui/link-base'
import { LinkEmail } from '@/shared/ui/link-email'
import { LinkExternal } from '@/shared/ui/link-external'
import { PaperBase } from '@/shared/ui/paper-base'
import { AppFooter } from '@/widgets/app-footer'
import { AppHeader } from '@/widgets/app-header'

const { t } = useLocale()
</script>

<template>
  <div class="AboutPage">
    <AppHeader :msg="t('ui.appHeaderTitle')" class="AboutPage_Header">
      <template #controls>
        <LocaleSwitcher />
      </template>
      <template #actionButtons>
        <LinkBase :to="{ name: ROUTES.reportBuilder.name }" size="lg">🡄 {{ t('ui.infoPage.backToApp') }}</LinkBase>
      </template>
    </AppHeader>

    <main class="AboutPage_Main Container">
      <PaperBase class="AboutPage_Content">
        <section class="AboutPage_Intro">
          <h2 class="Typo_Heading2">{{ t('ui.infoPage.title') }}</h2>
          <p class="AboutPage_Text">{{ t('ui.infoPage.introText') }}</p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.introNote') }}</p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.introFeatures') }}</p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.introLanguages') }}</p>
          <p class="AboutPage_Text">
            {{ t('ui.infoPage.introGuideBeforeLink') }}
            <LinkExternal :href="SRB_GUIDE_KPO_URL" size="md">{{ t('ui.infoPage.guideLinkText') }}</LinkExternal>
            {{ t('ui.infoPage.introGuideAfterLink') }}
          </p>
        </section>

        <section class="AboutPage_Section">
          <h3 class="Typo_Heading3">{{ t('ui.infoPage.storageTitle') }}</h3>
          <p class="AboutPage_Text">{{ t('ui.infoPage.storageText') }}</p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.storageNote') }}</p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.storageBackupNote') }}</p>
        </section>

        <section class="AboutPage_Section">
          <h3 class="Typo_Heading3">{{ t('ui.infoPage.conversionTitle') }}</h3>
          <p class="AboutPage_Text">
            {{ t('ui.infoPage.conversionTextBeforeLink') }}
            <LinkExternal :href="EXCHANGE_RATE_SITE_URL" size="md">{{ t('ui.infoPage.apiLinkText') }}</LinkExternal>
            {{ t('ui.infoPage.conversionTextAfterLink') }}
          </p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.conversionNote') }}</p>
        </section>

        <section class="AboutPage_Section">
          <h3 class="Typo_Heading3">{{ t('ui.infoPage.disclaimerTitle') }}</h3>
          <p class="AboutPage_Text">{{ t('ui.infoPage.disclaimerText') }}</p>
          <p class="AboutPage_Text">{{ t('ui.infoPage.disclaimerNote') }}</p>
          <p class="AboutPage_Text">
            {{ t('ui.infoPage.disclaimerRecommendationBeforeLink') }}
            <LinkExternal :href="NBS_SITE_URL" size="md">{{ t('ui.infoPage.bankLinkText') }}</LinkExternal>
            {{ t('ui.infoPage.disclaimerRecommendationAfterLink') }}
          </p>
        </section>

        <section class="AboutPage_Section">
          <h3 class="Typo_Heading3">{{ t('ui.infoPage.contactTitle') }}</h3>
          <p class="AboutPage_Text">
            {{ t('ui.infoPage.contactText') }} <LinkEmail :email="CONTACT_EMAIL" size="md" />
          </p>
        </section>
      </PaperBase>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &_Header {
    margin-block-end: 16px;
  }

  &_Main {
    flex: 1;
  }

  &_Content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &_Section,
  &_Intro {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &_Text {
    color: var(--color-text-default);
    font: var(--font-regular-text-base);
  }
}
</style>
