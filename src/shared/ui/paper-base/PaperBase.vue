<script setup lang="ts"></script>

<template>
  <div class="PaperBase">
    <slot />
  </div>
</template>

<style scoped>
.PaperBase {
  border-radius: 24px;
  padding: 30px;
  background: var(--color-background-surface);
  box-shadow: var(--shadow-xl);
}
</style>
