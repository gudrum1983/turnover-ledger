<script setup lang="ts">
import { computed } from 'vue'
import { formatDateForUi, formatMoney, getRowTotals } from '@/shared/lib'
import type { ReportRow, ReportScript } from '@/shared/types/report.ts'

type ReportRowProps = {
  index: number
  row: ReportRow
  script: ReportScript
}

const { index, row, script } = defineProps<ReportRowProps>()
const totals = computed(() => getRowTotals(row))
const summary = computed(() => [formatDateForUi(row.date), row.description].filter(Boolean).join(', '))
</script>

<template>
  <tr class="ReportDocumentRow">
    <td>{{ index + 1 }}</td>
    <td>{{ summary }}</td>
    <td class="Text_AlginRight">
      {{ formatMoney(row.amounts.goods.rsdCents ?? 0, { locale: script }) }}
    </td>
    <td class="Text_AlginRight">
      {{ formatMoney(row.amounts.services.rsdCents ?? 0, { locale: script }) }}
    </td>
    <td class="Text_AlginRight">
      {{ formatMoney(totals.rsdCents, { locale: script }) }}
    </td>
  </tr>
</template>

<style scoped>
td {
  display: table-cell;
  vertical-align: inherit;
  unicode-bidi: isolate;
  padding: 2px 5px;
  border: 1px solid black;
}
</style>
