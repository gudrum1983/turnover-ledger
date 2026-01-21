<script setup lang="ts">
import ReportBuilderMetaForm from '@/widgets/report-builder/ui/ReportBuilderMetaForm.vue'
import ReportActions from '@/widgets/report-builder/ui/ReportActions.vue'
import ReportTable from '@/widgets/report-builder/ui/ReportTable.vue'
import { ROUTES } from '@/shared/constants/routes.ts'
import BasePaper from '@/shared/ui/BasePaper.vue'
import AppHeader from '@/app/AppHeader.vue'
</script>

<template>
  <div class="ReportBuilderPage">
    <AppHeader msg="Книга КПО (паушал)" class="ReportBuilderPage_Header" />
    <main class="ReportBuilderPage_Main Container">
      <BasePaper>
        <RouterLink :to="{ name: ROUTES.reportPreview.name }">Link to preview</RouterLink>
        <ReportActions />
        <ReportBuilderMetaForm />
        <ReportTable />
      </BasePaper>
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
