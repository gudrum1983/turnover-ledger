<script setup lang="ts">
import { type VNode } from 'vue'
import { BaseDropdownButton } from '@/shared/ui'
import { useLocaleStore } from '@/app/stores/localeStore.ts'

defineProps<{
  msg: string
}>()

defineSlots<{
  actionButtons?: () => VNode | VNode[]
}>()

const localeStore = useLocaleStore()

const locales = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'srLat', label: 'Srpski' },
  { code: 'srCyr', label: 'Српски' },
] as const

/*Todo - чекнуть по ошибке апдейта и изменить компоновку лейаута*/
</script>

<template>
  <header class="Container AppHeader no-print">
    <h1>{{ msg }}</h1>

    <div class="AppHeader_Actions">
      <div class="AppHeader_Locale">
        <BaseDropdownButton
          size="xs"
          variant="outline"
          color="primary"
          :options="locales.map((locale) => ({ value: locale.code, label: locale.label }))"
          :model-value="localeStore.currentLocale"
          @update:model-value="(value) => localeStore.setLocale(value as typeof localeStore.currentLocale)"
        />
      </div>
      <slot name="actionButtons" />
    </div>
  </header>
</template>

<style>
.AppHeader {
  min-height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.AppHeader_Actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.AppHeader_Locale {
  display: inline-flex;
}
</style>
