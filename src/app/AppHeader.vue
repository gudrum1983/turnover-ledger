<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { ROUTES } from '@/shared/variables/routes.ts'
import BaseButton from '@/shared/ui/BaseButton.vue'

defineProps<{
  msg: string
}>()

const route = useRoute()
const router = useRouter()

const onPrint = () => {
  window.print()
}

const showHomeButton = computed(() => route.name !== ROUTES.homePage.name)

const showPrintButton = computed(() => route.name === ROUTES.previewPage.name)
</script>

<template>
  <header class="Container AppHeader no-print">
    <h1>{{ msg }}</h1>

    <div class="AppHeader_Actions">
      <BaseButton
        color="default"
        variant="outline"
        v-if="showHomeButton"
        @click="router.push({ name: ROUTES.homePage.name })"
      >
        На главную
      </BaseButton>
      <BaseButton color="primary" v-if="showPrintButton" @click="onPrint">Печать</BaseButton>
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
}
</style>
