<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type VNode } from 'vue'
import { LogoBase } from '@/shared/ui-v2/logo-base'
import type { ButtonSize } from '@/shared/ui-v2/button-base/types'
import { LanguageSettings } from '@/features/language-settings'

type AppHeaderProps = {
  /** Основной заголовок страницы, отображаемый в h1. */
  title: string
  /** Подзаголовок страницы под основным заголовком. */
  subtitle: string
}

type AppHeaderSlots = {
  /** Кнопки действий страницы, отображаемые под основной частью шапки. */
  actionButtons?: (props: { size: ButtonSize }) => VNode | VNode[]
}

defineProps<AppHeaderProps>()
defineSlots<AppHeaderSlots>()

const headerSize = ref<'l' | 'm' | 's'>('s')
const HEADER_SIZES = {
  l: { titleClass: 'u-typo-h1-l', subtitleClass: 'u-typo-body-m', buttonSize: 'l' },
  m: { titleClass: 'u-typo-h1-l', subtitleClass: 'u-typo-body-m', buttonSize: 'l' },
  s: { titleClass: 'u-typo-h1-m', subtitleClass: 'u-typo-label-s', buttonSize: 'm' },
} as const
const sizeConfig = computed(() => HEADER_SIZES[headerSize.value])
let mediumViewport: MediaQueryList | undefined
let largeViewport: MediaQueryList | undefined

function updateHeaderSize() {
  headerSize.value = largeViewport?.matches ? 'l' : mediumViewport?.matches ? 'm' : 's'
}

onMounted(() => {
  mediumViewport = window.matchMedia('(min-width: 768px)')
  largeViewport = window.matchMedia('(min-width: 1024px)')
  mediumViewport.addEventListener('change', updateHeaderSize)
  largeViewport.addEventListener('change', updateHeaderSize)
  updateHeaderSize()
})

onUnmounted(() => {
  mediumViewport?.removeEventListener('change', updateHeaderSize)
  largeViewport?.removeEventListener('change', updateHeaderSize)
})
</script>

<template>
  <header class="u-container AppHeader no-print">
    <div class="AppHeader-Main">
      <div class="AppHeader-Logo">
        <LogoBase style="grid-area: logo" />
        <h1 style="grid-area: title" :class="sizeConfig.titleClass">
          {{ title }}
        </h1>
        <span style="grid-area: subtitle" :class="sizeConfig.subtitleClass">{{ subtitle }}</span>

        <div class="AppHeader-Locale">
          <LanguageSettings :size="headerSize" />
        </div>
      </div>
    </div>

    <div class="AppHeader-Actions">
      <slot name="actionButtons" :size="sizeConfig.buttonSize" />
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
