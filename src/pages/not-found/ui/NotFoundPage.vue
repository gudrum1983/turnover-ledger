<script setup lang="ts">
import { ROUTES } from '@/shared/constants/routes.ts'
import { LocaleSwitcher } from '@/features/locale-switcher'
import { AppHeader } from '@/widgets/app-header'
import { useLocale } from '@/shared/i18n'
import { LinkBase } from '@/shared/ui/link-base'
const { t } = useLocale()
</script>

<template>
  <div class="NotFoundPage Container">
    <AppHeader :msg="t('ui.appHeaderTitle')" class="ReportPreviewPage_Header">
      <template #controls>
        <LocaleSwitcher />
      </template>
    </AppHeader>
    <div class="NotFoundPage_Content">
      <div class="Typo_Display Text_AlginCenter">{{ t('ui.noPageMessage.title') }}</div>
      <p>{{ t('ui.noPageMessage.subtitle') }}</p>
      <LinkBase :to="{ name: ROUTES.reportBuilder.name }" size="lg">🡄 {{ t('ui.noPageMessage.link') }}</LinkBase>
    </div>
  </div>
</template>

<style scoped>
.NotFoundPage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2rem;
}

.NotFoundPage_Content {
  display: flex;
  min-height: calc(100vh - 200px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
