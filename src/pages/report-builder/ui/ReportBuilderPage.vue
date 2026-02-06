<script setup lang="ts">
import ReportBuilderMetaForm from '@/widgets/report-builder/ui/ReportBuilderMetaForm.vue'
import ReportActions from '@/widgets/report-builder/ui/ReportActions.vue'
import ReportTable from '@/widgets/report-builder/ui/ReportTable.vue'

import { BasePaper } from '@/shared/ui'
import AppHeader from '@/app/AppHeader.vue'
</script>

<template>
  <div class="ReportBuilderPage">
    <AppHeader msg="Книга КПО (паушал)" class="ReportBuilderPage_Header" />
    <main class="ReportBuilderPage_Main Container">
      <BasePaper class="ReportBuilderPage_layout">
        <ReportActions />
        <ReportBuilderMetaForm />
        <ReportTable />
      </BasePaper>
    </main>
  </div>
</template>

<style scoped lang="scss">
.ReportBuilderPage {
  .ReportBuilderPage_layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
