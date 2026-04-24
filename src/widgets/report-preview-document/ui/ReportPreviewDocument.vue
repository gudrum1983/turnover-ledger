<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ReportDocumentRow } from '@/entities/report-row'
import {
  HEADER_FIELDS,
  getReportFooterLabel,
  getReportHeaderLabel,
  getReportTableLabel,
  getReportTitleLabel,
  getReportTotalLabel,
  getTableTotals,
  type FooterField,
  type HeaderField,
  type ReportScript,
  type TableField,
  type TitleField,
  useReportStore,
} from '@/entities/report'
import { formatMoney } from '@/shared/lib'

type Props = {
  landscape?: boolean
  script?: ReportScript
}

const props = withDefaults(defineProps<Props>(), {
  landscape: true,
  script: 'srLat',
})

const store = useReportStore()
const { formData, rows } = storeToRefs(store)

const classColumn = computed(() => [{ ReportPreviewDocument_Column_landscape: props.landscape }])
const classSignature = computed(() => [{ ReportPreviewDocument_SignaturePlace_landscape: props.landscape }])
const footerRowsStartIndex = computed(() => Math.max(rows.value.length - 1, 0))
const mainRows = computed(() => rows.value.slice(0, footerRowsStartIndex.value))
const footerRows = computed(() => rows.value.slice(footerRowsStartIndex.value))
const tableTotals = computed(() => getTableTotals(rows.value))
const totalRsd = computed(() => formatMoney(tableTotals.value.rsdCents, { locale: props.script }))

const getHeaderLabel = (key: HeaderField) => getReportHeaderLabel(key, props.script)
const getTitleLabel = (key: TitleField) => getReportTitleLabel(key, props.script)
const getTableLabel = (key: TableField) => getReportTableLabel(key, props.script)
const getFooterLabel = (key: FooterField) => getReportFooterLabel(key, props.script)
const getTableTotalLabel = () => getReportTotalLabel(props.script)
</script>

<template>
  <div class="ReportPreviewDocument Typo_ReportBody">
    <ul class="ReportPreviewDocument_Header">
      <li v-for="field in HEADER_FIELDS" :key="field">
        <span class="Typo_ReportBodyAccent">{{ getHeaderLabel(field) }}:</span> {{ formData.header[field] }}
      </li>
    </ul>

    <div class="ReportPreviewDocument_Title Typo_ReportTitle">
      <div>{{ getTitleLabel('firstLine') }}</div>
      <div>{{ getTitleLabel('secondLine') }}</div>
    </div>

    <table class="ReportPreviewDocument_Table">
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
          <td class="ReportPreviewDocument_Column ReportPreviewDocument_Column_type_num">1</td>
          <td class="ReportPreviewDocument_Column ReportPreviewDocument_Column_type_description">2</td>
          <td class="ReportPreviewDocument_Column">3</td>
          <td class="ReportPreviewDocument_Column">4</td>
          <td class="ReportPreviewDocument_Column">5</td>
        </tr>
      </thead>
      <tbody>
        <ReportDocumentRow
          v-for="(row, index) in mainRows"
          :key="row.id"
          :index="index"
          :row="row"
          :script="props.script"
        />
      </tbody>
      <tbody class="ReportPreviewDocument_TrailingGroup">
        <ReportDocumentRow
          v-for="(row, index) in footerRows"
          :key="row.id"
          :index="footerRowsStartIndex + index"
          :row="row"
          :script="props.script"
        />
        <tr class="Typo_ReportTableAccent">
          <td colspan="4" class="Text_AlginRight">{{ getTableTotalLabel() }}</td>
          <td class="Text_AlginRight">{{ totalRsd }}</td>
        </tr>
        <tr class="ReportPreviewDocument_FooterRow">
          <td colspan="5" class="ReportPreviewDocument_FooterSignature">
            <div class="ReportPreviewDocument_Footer">
              <div class="ReportPreviewDocument_SignaturePlace" :class="classSignature">
                <div class="Typo_ReportTableAccent">{{ getFooterLabel('preparedBy') }}</div>
                <div class="ReportPreviewDocument_Signature">{{ formData.footer.preparedBy }}</div>
              </div>

              <div class="ReportPreviewDocument_SignaturePlace" :class="classSignature">
                <div class="Typo_ReportTableAccent">{{ getFooterLabel('responsiblePerson') }}</div>
                <div class="ReportPreviewDocument_Signature">{{ formData.footer.responsiblePerson }}</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.ReportPreviewDocument {
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

  &_TrailingGroup {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  &_FooterRow {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 0;

    td {
      border: 0;
      padding: 10mm 0 0;
    }
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

.ReportPreviewDocument_Table {
  display: table;
  box-sizing: border-box;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;

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

  .ReportPreviewDocument_Column {
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

  .ReportPreviewDocument_Column_landscape {
    .ReportPreviewDocument_Column {
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

.ReportPreviewDocument_Table {
  .ReportPreviewDocument_FooterSignature {
    padding-top: 10mm;
    border: 0;
  }
}
</style>
