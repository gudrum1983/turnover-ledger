<script setup lang="ts">
import { computed } from 'vue'
import { ButtonDropdown } from '@/shared/ui/button-dropdown'
import { LOCALE_LABEL_KEY_BY_LOCALE, SUPPORTED_LOCALES, isSupportedLocale, useLocale } from '@/shared/i18n'

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
</script>

<template>
  <ButtonDropdown
    rootClass="LocaleSwitcher"
    size="xs"
    variant="outlined"
    color="primary"
    :options="localeOptions"
    :model-value="locale"
    @update:model-value="handleLocaleUpdate"
  />
</template>
