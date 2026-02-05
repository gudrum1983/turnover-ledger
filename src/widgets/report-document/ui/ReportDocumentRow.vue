<script setup lang="ts">
import { formatDateForUi } from '@/shared/lib/date/date.ts'
import { formatMoney, sumCents } from '@/shared/lib/money/money.ts'
type ReportRowProps = {
  index: number
  date: string
  description: string
  amountsGoods: number
  amountsServices: number
}

const { index, date, description, amountsGoods, amountsServices } = defineProps<ReportRowProps>()
</script>

<template>
  <tr>
    <td>{{ index + 1 }}</td>
    <td>{{ formatDateForUi(date, { withTrailingDot: true }) + ' ' + description }}</td>
    <td class="Text_AlginRight">{{ formatMoney(amountsGoods, { showMinorZeros: true, locale: 'sr' }) }}</td>
    <td class="Text_AlginRight">{{ formatMoney(amountsServices, { showMinorZeros: true, locale: 'sr' }) }}</td>
    <td class="Text_AlginRight">
      {{ formatMoney(sumCents([amountsGoods, amountsServices]), { showMinorZeros: true, locale: 'sr' }) }}
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
