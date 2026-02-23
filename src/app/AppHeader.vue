<script setup lang="ts">
import { computed, type VNode } from 'vue'
import { BaseDropdownButton } from '@/shared/ui'
import { useLocale } from '@/shared/i18n'
import { LOCALE_LABEL_KEY_BY_LOCALE, SUPPORTED_LOCALES, isSupportedLocale } from '@/shared/i18n'

defineProps<{
  msg: string
}>()

defineSlots<{
  actionButtons?: () => VNode | VNode[]
}>()

const { locale, setLocale, t } = useLocale()

const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    value: code,
    label: t(LOCALE_LABEL_KEY_BY_LOCALE[code]),
  })),
)

const handleLocaleUpdate = (value: string | null) => {
  if (value && isSupportedLocale(value)) {
    setLocale(value)
  }
}

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
          :options="localeOptions"
          :model-value="locale"
          @update:model-value="handleLocaleUpdate"
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
