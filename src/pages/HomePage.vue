<script setup lang="ts">
import ReportMetaForm from '@/widgets/report/ReportMetaForm.vue'
import ReportActions from '@/widgets/report/ReportActions.vue'
import ReportTable from '@/widgets/report/ReportTable.vue'
import { ROUTES } from '@/shared/variables/routes.ts'
import BasePaper from '@/shared/ui/BasePaper.vue'
</script>

<template>
  <BasePaper>
    <RouterLink :to="{ name: ROUTES.previewPage.name }">Link to preview</RouterLink>
    <ReportActions />
    <ReportMetaForm />
    <ReportTable />
  </BasePaper>
</template>

<style scoped lang="scss"></style>
