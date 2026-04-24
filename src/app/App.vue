<script setup lang="ts">
import { watchEffect } from 'vue'
import { useLocale } from '@/shared/i18n'

const { t } = useLocale()

watchEffect(() => {
  document.title = t('ui.appHeaderTitle')
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
