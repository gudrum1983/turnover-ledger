<script setup lang="ts"></script>

<template>
  <div class="BasePaper">
    <slot />
  </div>
</template>

<style scoped>
.BasePaper {
  border-radius: 24px;
  padding: 30px;
  background: var(--color-background-surface);
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
