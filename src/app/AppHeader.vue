<script setup lang="ts">
import { type VNode } from 'vue'

defineProps<{
  msg: string
}>()

defineSlots<{
  actionButtons?: () => VNode | VNode[]
}>()
</script>

<template>
  <header class="Container AppHeader no-print">
    <h1>{{ msg }}</h1>

    <div class="AppHeader_Actions">
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
}
</style>
