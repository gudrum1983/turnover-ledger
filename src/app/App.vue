<script setup lang="ts">
import AppHeader from '@/app/AppHeader.vue'
</script>

<template>
  <div class="App">
    <AppHeader msg="Книга КПО (паушал)" class="App_Header" />
    <main class="App_Main Container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.App {
  width: 100%;
  margin: 50px auto;
}

.App_Header {
  margin-block-end: 40px;
}

.App_Main {
  display: flex;
  flex-direction: column;
}

@media print {
  .App {
    margin: 0;
    padding: 0;
  }
}
</style>
