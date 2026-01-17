<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <header class="AppHeader">
    <h1>{{ msg }}</h1>
  </header>
</template>

<style scoped></style>
