<script setup lang="ts">
import { ROUTES } from '@/shared/constants/routes.ts'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { AppHeader } from '@/widgets/app-header'
import { useLocale } from '@/shared/i18n'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import NotFoundIllustration from './NotFoundIllustration.vue'
import { useRouter } from 'vue-router'
import { AppFooter } from '@/widgets/app-footer'
const { t } = useLocale()
const router = useRouter()

function backToApp() {
  router.push({ name: ROUTES.reportBuilder.name })
}
</script>

<template>
  <div class="NotFoundPage">
    <AppHeader
      :title="t('ui.appHeaderTitle')"
      subtitle="Учет доходов для паушальных налогоплательщиков"
      class="ReportBuilderPage_Header"
    >
      <template #controls>
        <LocaleSwitcher />
      </template>
    </AppHeader>
    <div class="NotFoundPage-Content u-container">
      <NotFoundIllustration class="NotFoundPage-Illustration" />
      <h1 class="NotFoundPage-Title u-typo-h1-l">{{ t('ui.noPageMessage.title') }}</h1>
      <p class="NotFoundPage-Subtitle u-typo-body-m">{{ t('ui.noPageMessage.subtitle') }}</p>
      <ButtonBase class="NotFoundPage-Button" variant="accent" @click="backToApp">
        {{ t('ui.infoPage.backToApp') }}
      </ButtonBase>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.NotFoundPage {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.NotFoundPage-Content {
  padding-top: 8px;
  display: flex;
  /*  min-height: calc(100vh - 200px);*/
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.NotFoundPage-Title {
  padding-top: 8px;
  text-align: center;
}

.NotFoundPage-Subtitle {
  padding-top: 16px;
  white-space: pre-line;
  text-align: center;
}

.NotFoundPage-Button {
  margin-top: 40px;
}

.NotFoundPage-Illustration {
  width: 200px;
}

@media (min-width: 768px) {
  .NotFoundPage-Illustration {
    width: 355px;
  }
}
</style>
