<script setup lang="ts">
import ReportDocument from '@/pages/ReportDocument.vue'
</script>

<template>
  <div class="ReportPreviewPage">
    <section class="report-document">
      <ReportDocument />
    </section>
  </div>
</template>

<style scoped>
/* Базово — для экрана */
.report-document {
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 12px;
  width: 297mm;
  min-height: 210mm;
  padding: 15mm;
  background: white;
}
/* печать — только для самого документа */
@media print {
  .report-document {
    width: 100%;
    min-height: fit-content;
    margin: 0;
    padding: 0;
  }
}
</style>
