<script setup lang="ts">
defineProps<{
  /** Порядок смены содержимого, как у Vue Transition. */
  mode?: 'out-in' | 'in-out'
}>()
</script>

<template>
  <Transition name="ui-fade" :mode="mode">
    <slot />
  </Transition>
</template>

<style>
.ui-fade-enter-active,
.ui-fade-leave-active {
  transition: opacity 200ms ease;
}

.ui-fade-enter-from,
.ui-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ui-fade-enter-active,
  .ui-fade-leave-active {
    transition: none;
  }
}
</style>
