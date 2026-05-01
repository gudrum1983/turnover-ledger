<script setup lang="ts">
import { ROUTES } from '@/shared/constants/routes'
import { useLocale } from '@/shared/i18n'
import { LinkBase } from '@/shared/ui/link-base'

const { t } = useLocale()
</script>

<template>
  <footer class="AppFooter no-print Typo_Caption">
    <div class="Container AppFooter_Content">
      <div class="AppFooter_Row">
        <span class="AppFooter_Note">{{ t('ui.footer.localStorageNotice') }}</span> ·
        <LinkBase size="sm" :to="{ name: ROUTES.about.name }">{{ t('ui.footer.about') }}</LinkBase>
      </div>
      <div class="AppFooter_Row">
        <p>{{ t('ui.appHeaderTitle') }}</p>
        ·
        <p>© Ekaterina Kochkina, 2026</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.AppFooter {
  margin-block-start: 20px;
  padding-block-end: 20px;
  color: var(--color-text-caption);
  border-top: 1px solid var(--color-border-default);
  width: 100%;

  &_Content {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    padding-block-start: 12px;
  }

  &_Row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: baseline;
  }
}
</style>
