<script setup lang="ts">
import { computed, type VNode } from 'vue'
import { ButtonDropdown } from '@/shared/ui/button-dropdown'
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
    <div class="AppHeader_main">
      <h1 class="Typo_Heading1">{{ msg }}</h1>
      <div class="AppHeader_Locale">
        <ButtonDropdown
          size="xs"
          variant="outlined"
          color="primary"
          :options="localeOptions"
          :model-value="locale"
          @update:model-value="handleLocaleUpdate"
        />
      </div>
    </div>

    <div class="AppHeader_Actions">
      <slot name="actionButtons" />
    </div>
  </header>
</template>

<style>
.AppHeader {
  min-height: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.AppHeader_main {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.AppHeader_Actions {
  width: 100%;
  display: flex;
  gap: 4px;
}
.AppHeader_Locale {
  display: inline-flex;
}
</style>
