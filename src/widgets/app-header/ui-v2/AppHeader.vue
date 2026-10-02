<script setup lang="ts">
import type { VNode } from 'vue'
import LogoHeader from '@/widgets/app-header/ui-v2/LogoHeader.vue'
import { LanguageSettings } from '@/features/language-settings'

type AppHeaderProps = {
  /** Основной заголовок страницы, отображаемый в h1. */
  title: string
  /** Подзаголовок страницы под основным заголовком. */
  subtitle: string
}

type AppHeaderSlots = {
  /** Кнопки действий страницы, отображаемые под основной частью шапки. */
  actionButtons?: () => VNode | VNode[]
}

defineProps<AppHeaderProps>()
defineSlots<AppHeaderSlots>()
</script>

<template>
  <header class="Container AppHeader no-print">
    <div class="AppHeader-Main">
      <div class="AppHeader-Logo">
        <LogoHeader style="grid-area: logo" />
        <h1 style="grid-area: title" class="u-typo-h1-l">{{ title }}</h1>
        <span style="grid-area: subtitle" class="u-typo-body-m">{{ subtitle }}</span>

        <div class="AppHeader-Locale">
          <LanguageSettings />
        </div>
      </div>
    </div>

    <div class="AppHeader-Actions">
      <slot name="actionButtons" />
    </div>
  </header>
</template>

<style>
.AppHeader {
  padding: 0;
  min-height: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.AppHeader-Main {
  padding: 16px 0;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.AppHeader-Logo {
  width: 100%;
  display: grid;
  grid-template-columns: min-content auto max-content;
  grid-template-areas:
    'logo title locale'
    'subtitle subtitle locale';
  gap: 8px;
  align-items: center;
}

.AppHeader-Actions {
  width: 100%;
  display: flex;
  gap: 4px;
}
.AppHeader-Locale {
  display: inline-flex;
  grid-area: locale;
}
</style>
