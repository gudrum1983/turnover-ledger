<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ReportDocumentRow } from '@/entities/report-row'
import {
  HEADER_FIELDS,
  type FooterField,
  type HeaderField,
  type TableField,
  type TitleField,
} from '@/shared/constants/reportFields.ts'
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import { getTableTotals, type ReportScript, useReportStore } from '@/entities/report'
import { formatMoney } from '@/shared/lib'

type Props = {
  landscape?: boolean
  script?: ReportScript
}

const props = withDefaults(defineProps<Props>(), {
  landscape: true,
  script: 'srLat',
})

const TOTAL_LABEL_BY_SCRIPT: Record<ReportScript, string> = {
  srLat: 'Ukupno',
  srCyr: 'Укупно',
}

const store = useReportStore()
const { formData, rows } = storeToRefs(store)

const classColumn = computed(() => [{ ReportDocument_Column_landscape: props.landscape }])
const classSignature = computed(() => [{ ReportDocument_SignaturePlace_landscape: props.landscape }])
const tableTotals = computed(() => getTableTotals(rows.value))
const totalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: props.script }))

const getHeaderLabel = (key: HeaderField) => KPO_DICTIONARY.header[key][props.script]
const getTitleLabel = (key: TitleField) => KPO_DICTIONARY.title[key][props.script]
const getTableLabel = (key: TableField) => KPO_DICTIONARY.table[key][props.script]
const getFooterLabel = (key: FooterField) => KPO_DICTIONARY.footer[key][props.script]
const getTableTotalLabel = () => TOTAL_LABEL_BY_SCRIPT[props.script]
</script>

<template>
  <div class="ReportDocument Typo_ReportBody">
    <ul class="ReportDocument_Header">
      <li v-for="field in HEADER_FIELDS" :key="field">
        <span class="Typo_ReportBodyAccent">{{ getHeaderLabel(field) }}:</span> {{ formData.header[field] }}
      </li>
    </ul>

    <div class="ReportDocument_Title Typo_ReportTitle">
      <div>{{ getTitleLabel('firstLine') }}</div>
      <div>{{ getTitleLabel('secondLine') }}</div>
    </div>

    <table class="ReportDocument_Table">
      <thead class="Typo_ReportTableAccent">
        <tr>
          <td rowspan="2" colspan="1">{{ getTableLabel('rowNumber') }}</td>
          <td rowspan="2" colspan="1">
            {{ getTableLabel('dateAndDescription') }}
          </td>
          <td rowspan="1" colspan="2" class="Typo_Uppercase">{{ getTableLabel('income') }}</td>
          <td rowspan="2" colspan="1" class="Typo_Uppercase">{{ getTableLabel('totalIncome') }}</td>
        </tr>
        <tr>
          <td>{{ getTableLabel('incomeFromProducts') }}</td>
          <td>{{ getTableLabel('incomeFromServices') }}</td>
        </tr>
        <tr :class="classColumn">
          <td class="ReportDocument_Column ReportDocument_Column_type_num">1</td>
          <td class="ReportDocument_Column ReportDocument_Column_type_description">2</td>
          <td class="ReportDocument_Column">3</td>
          <td class="ReportDocument_Column">4</td>
          <td class="ReportDocument_Column">5</td>
        </tr>
      </thead>
      <tbody>
        <ReportDocumentRow
          v-for="(row, index) in store.rows"
          :key="row.id"
          :index="index"
          :row="row"
          :script="props.script"
        />
      </tbody>
      <tfoot>
        <tr class="Typo_ReportTableAccent">
          <td colspan="4" class="Text_AlginRight">{{ getTableTotalLabel() }}</td>
          <td class="Text_AlginRight">{{ totalRsd }}</td>
        </tr>
      </tfoot>
    </table>

    <div class="ReportDocument_Footer">
      <div class="ReportDocument_SignaturePlace" :class="classSignature">
        <div class="Typo_ReportTableAccent">{{ getFooterLabel('preparedBy') }}</div>
        <div class="ReportDocument_Signature">{{ formData.footer.preparedBy }}</div>
      </div>

      <div class="ReportDocument_SignaturePlace" :class="classSignature">
        <div class="Typo_ReportTableAccent">{{ getFooterLabel('responsiblePerson') }}</div>
        <div class="ReportDocument_Signature">{{ formData.footer.responsiblePerson }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportDocument {
  font-family: 'Open Sans', sans-serif !important;

  &_Header {
    margin-block-end: 20mm;
  }
  &_Title {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
    margin-block-end: 10mm;
  }

  &_Footer {
    display: flex;
    justify-content: space-between;
  }

  &_SignaturePlace {
    display: flex;
    flex-direction: column;
    min-width: 28%;
    width: max-content;
    max-width: 40%;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    &_landscape {
      min-width: 18%;
      max-width: 30%;
    }
  }

  &_Signature {
    border-bottom: 1px solid black;
    width: 100%;
    text-align: center;
    hyphens: auto;
    overflow-wrap: break-word;
  }
}

.ReportDocument_Table {
  display: table;
  box-sizing: border-box;
  border-collapse: collapse;
  border-spacing: 0;
  margin-block-end: 20mm;
  td,
  th {
    border: 1px solid black;
  }

  td {
    display: table-cell;
    vertical-align: inherit;
    unicode-bidi: isolate;
    padding: 2px 5px;
  }

  thead {
    text-align: center;
  }

  .ReportDocument_Column {
    width: 100%;
    max-width: 20%;
    padding: 0 10px;

    &_type {
      &_num {
        max-width: 8%;
      }

      &_description {
        max-width: 32%;
      }
    }
  }

  .ReportDocument_Column_landscape {
    .ReportDocument_Column {
      width: 100%;
      max-width: 13%;

      &_type {
        &_num {
          max-width: 7%;
        }

        &_description {
          max-width: 56%;
        }
      }
    }
  }
}
</style>
