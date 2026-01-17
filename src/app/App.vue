<script setup lang="ts">
import AppHeader from '@/app/AppHeader.vue'
import ReportMetaForm from '@/widgets/report/ReportMetaForm.vue'
import ReportActions from '@/widgets/report/ReportActions.vue'
import ReportTable from '@/widgets/report/ReportTable.vue'
</script>

<template>
  <div>
    <AppHeader msg="Книга КПО (паушал)" />
    <ReportActions />
    <ReportMetaForm />
    <ReportTable />
  </div>
</template>

<style scoped></style>
