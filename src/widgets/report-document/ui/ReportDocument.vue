<script setup lang="ts">
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import { computed } from 'vue'

/*
const headerRows = ['pib', 'taxpayer', 'companyName', 'address', 'taxNumber', 'activityCode']
*/

type Props = {
  landscape?: boolean
}

const { landscape = false } = defineProps<Props>()

const classColumn = computed(() => [{ ReportDocument_Column_landscape: landscape }])
const classSignature = computed(() => [{ ReportDocument_SignaturePlace_landscape: landscape }])
</script>

<template>
  <div class="ReportDocument Typo_ReportBody">
    <ul class="ReportDocument_Header">
      <li v-for="(item, index) in KPO_DICTIONARY.header" :key="index" v-bind="item">
        <span class="Typo_ReportBodyAccent">{{ item.srLat }}:</span> {{ item.ru }}
      </li>
    </ul>

    <div class="ReportDocument_Title Typo_ReportTitle">
      <div>{{ KPO_DICTIONARY.title.row1.srLat }}</div>
      <div>{{ KPO_DICTIONARY.title.row2.srLat }}</div>
    </div>

    <table class="ReportDocument_Table">
      <thead class="Typo_ReportTableAccent">
        <tr>
          <td rowspan="2" colspan="1">{{ KPO_DICTIONARY.table.rowNumber.srLat }}</td>
          <td rowspan="2" colspan="1">
            {{ KPO_DICTIONARY.table.dateAndDescription.srLat }}
          </td>
          <td rowspan="1" colspan="2" class="Typo_Uppercase">{{ KPO_DICTIONARY.table.income.srLat }}</td>
          <td rowspan="2" colspan="1" class="Typo_Uppercase">{{ KPO_DICTIONARY.table.totalIncome.srLat }}</td>
        </tr>
        <tr>
          <td>{{ KPO_DICTIONARY.table.incomeFromProducts.srLat }}</td>
          <td>{{ KPO_DICTIONARY.table.incomeFromServices.srLat }}</td>
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
        <tr>
          <td>1</td>
          <td>текст 2</td>
          <td>текст 3</td>
          <td>текст 4</td>
          <td>текст 5</td>
        </tr>
        <tr>
          <td>2</td>
          <td>текст 2</td>
          <td>текст 3</td>
          <td>текст 4</td>
          <td>текст 5</td>
        </tr>
        <tr>
          <td>3</td>
          <td>текст 2</td>
          <td>текст 3</td>
          <td>текст 4</td>
          <td>текст 5</td>
        </tr>
        <tr>
          <td>4</td>
          <td>текст 2</td>
          <td>текст 3</td>
          <td>текст 4</td>
          <td>текст 5</td>
        </tr>
        <tr>
          <td>5</td>
          <td>текст 2</td>
          <td>текст 3</td>
          <td>текст 4</td>
          <td>текст 5</td>
        </tr>
      </tbody>
    </table>

    <div class="ReportDocument_Footer">
      <div class="ReportDocument_SignaturePlace" :class="classSignature">
        <div class="Typo_ReportTableAccent">{{ KPO_DICTIONARY.footer.preparedBy.srLat }}</div>
        <div class="ReportDocument_Signature">{{ KPO_DICTIONARY.footer.preparedBy.ru }}</div>
      </div>

      <div class="ReportDocument_SignaturePlace" :class="classSignature">
        <div class="Typo_ReportTableAccent">{{ KPO_DICTIONARY.footer.responsiblePerson.srLat }}</div>
        <div class="ReportDocument_Signature">{{ KPO_DICTIONARY.footer.responsiblePerson.ru }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportDocument {
  font-family: 'Open Sans', sans-serif !important;
}

.ReportDocument_Header {
  margin-block-end: 20mm;
}

.ReportDocument_Title {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-transform: uppercase;
  margin-block-end: 10mm;
}

.ReportDocument_Footer {
  display: flex;

  justify-content: space-between;
}
.ReportDocument_SignaturePlace {
  display: flex;
  flex-direction: column;
  min-width: 28%;
  width: max-content;
  max-width: 40%;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  &_landscale {
    min-width: 18%;
    max-width: 30%;
  }
}

.ReportDocument_Signature {
  border-bottom: 1px solid black;
  width: 100%;
  text-align: center;
  /* Умные переносы с дефисами для русского языка */
  hyphens: auto;
  /*  !* Принудительный разрыв длинных слов *!
  word-break: break-all;*/
  /* Разрыв неразрывных слов */
  overflow-wrap: break-word;
}

.ReportDocument_Table {
  display: table;
  box-sizing: border-box;
  /*  text-indent: initial;
  unicode-bidi: isolate;*/
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
    padding: 2px 10px;
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
          max-width: 5%;
        }

        &_description {
          max-width: 56%;
        }
      }
    }
  }
}
</style>
