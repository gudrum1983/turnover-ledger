<script setup lang="ts">
import type { VNode } from 'vue'

defineProps<{
  msg: string
}>()

defineSlots<{
  controls?: () => VNode | VNode[]
  actionButtons?: () => VNode | VNode[]
}>()
</script>

<template>
  <header class="Container AppHeader no-print">
    <div class="AppHeader_main">
      <h1 class="Typo_Heading1">{{ msg }}</h1>
      <div class="AppHeader_Locale">
        <slot name="controls" />
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
