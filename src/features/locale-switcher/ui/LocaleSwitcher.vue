<script setup lang="ts">
import { computed } from 'vue'
import { ButtonDropdown } from '@/shared/ui/button-dropdown'
import { LOCALE_META, SUPPORTED_LOCALES, isSupportedLocale, useLocale } from '@/shared/i18n'
import { IconLanguage } from '@/shared/ui/icons'

const { locale, setLocale } = useLocale()

const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    value: code,
    label: LOCALE_META[code].label,
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
  >
    <template #trigger>
      <span class="LocaleSwitcher_Trigger">
        <IconLanguage class="LocaleSwitcher_Icon" />
        <span class="LocaleSwitcher_Label">{{ LOCALE_META[locale].shortLabel }}</span>
      </span>
    </template>
  </ButtonDropdown>
</template>

<style scoped lang="scss">
.LocaleSwitcher_Trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.LocaleSwitcher_Icon {
  width: 16px;
  height: 16px;
}

.LocaleSwitcher_Label {
  white-space: nowrap;
}
</style>
