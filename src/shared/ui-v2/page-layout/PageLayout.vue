<script setup lang="ts">
defineProps<{
  mainClass?: string
}>()
</script>

<template>
  <div class="PageLayout">
    <div class="PageLayout-Header no-print">
      <slot name="header" />
    </div>
    <main class="PageLayout-Main" :class="mainClass">
      <slot />
    </main>
    <div class="PageLayout-Footer no-print">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.PageLayout {
  display: flex;
  flex-direction: column;
  /* Высота экрана ограничивает контейнер, позволяя нижнему отступу сжиматься. Длинная страница прокручивается целиком. */
  height: 100vh;
  height: 100dvh;
}

.PageLayout-Header,
.PageLayout-Footer {
  flex: 0 0 auto;
}

.PageLayout-Main {
  flex: 1 0 auto;
}

/* При нехватке высоты сжимается только нижний отступ, а не содержимое страницы. */
.PageLayout::after {
  content: '';
  flex: 0 1 40px;
}

@media print {
  .PageLayout {
    display: block;
    height: auto;
  }

  .PageLayout::after {
    display: none;
  }
}
</style>
