<script setup lang="ts">
import AppHeader from '@/app/AppHeader.vue'
import ReportMetaForm from '@/widgets/report/ReportMetaForm.vue'
import ReportActions from '@/widgets/report/ReportActions.vue'
import ReportTable from '@/widgets/report/ReportTable.vue'
</script>

<template>
  <div class="App">
    <AppHeader msg="Книга КПО (паушал)" />
    <main class="App_Main Container">
      <ReportActions />
      <ReportMetaForm />
      <ReportTable />
    </main>
  </div>
</template>

<style scoped>
.App {
  width: 100%;
  margin: 50px auto;
}

.App_Main {
  display: flex;
  flex-direction: column;
}
</style>
