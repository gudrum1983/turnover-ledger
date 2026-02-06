<script setup lang="ts">
import { computed } from 'vue'
import { formatDateForUi, formatMoney, getRowTotals } from '@/shared/lib'
import type { ReportRow } from '@/shared/types/report.ts'

type ReportRowProps = {
  index: number
  row: ReportRow
}

const { index, row } = defineProps<ReportRowProps>()
const totals = computed(() => getRowTotals(row))
</script>

<template>
  <tr>
    <td>{{ index + 1 }}</td>
    <td>{{ formatDateForUi(row.date, { withTrailingDot: true }) + ' ' + row.description }}</td>
    <td class="Text_AlginRight">
      {{ formatMoney(row.amounts.goods.rsdCents ?? 0, { showMinorZeros: true, locale: 'sr' }) }}
    </td>
    <td class="Text_AlginRight">
      {{ formatMoney(row.amounts.services.rsdCents ?? 0, { showMinorZeros: true, locale: 'sr' }) }}
    </td>
    <td class="Text_AlginRight">
      {{ formatMoney(totals.rsdCents, { showMinorZeros: true, locale: 'sr' }) }}
    </td>
  </tr>
</template>

<style scoped>
td {
  display: table-cell;
  vertical-align: inherit;
  unicode-bidi: isolate;
  padding: 2px 10px;
  border: 1px solid black;
}
</style>
