<script setup lang="ts">
import { computed } from 'vue'
import BaseTag from '@/shared/ui/BaseTag.vue'
import ReportTableRowButton from '@/widgets/report-builder/ui/ReportTableRowButton.vue'

type ReportTableRowProps = {
  index: number
  date: string
  size: 'full' | 'short'
  description: string
  counterparty: string
  incomeCurrency: string
  incomeFromProductsCurrency: string
  incomeFromProductsCurrencyAmount: string
  incomeFromProducts: string
  incomeFromServicesCurrency: string
  incomeFromServicesCurrencyAmount: string
  incomeFromServices: string
  totalIncomeCurrency: string
  totalIncomeCurrencyAmount: string
  totalIncome: string
}

const props = defineProps<ReportTableRowProps>()

const emit = defineEmits<{
  (event: 'edit', index: number): void
  (event: 'copy', index: number): void
  (event: 'remove', index: number): void
}>()

const isEven = computed(() => props.index % 2 === 0)

const isShort = computed(() => props.size === 'short')
</script>

<template>
  <div class="ReportTableRow" :class="{ ReportTableRow_even: isEven, ReportTableRow_short: isShort }">
    <div class="ReportTableRow_Column ReportTableRow_Column_type_number">
      {{ index + 1 }}
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_description">
      <div class="ReportTableRow_Description">
        <BaseTag class="ReportTableRow_Tag" :label="incomeFromProductsCurrency" />
        {{ [date, counterparty, description].filter(Boolean).join(', ') }}
        <!--        это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для
        текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и
        форм шрифтов, используя Lorem Ipsum для распечатки образцов.-->
      </div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income">
      <div v-if="!isShort">Тов.</div>
      <div v-if="!isShort">Усл.</div>
      <div>Сум.</div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income ReportTableRow_Column_font_secondary">
      <div v-if="!isShort">{{ incomeFromServicesCurrencyAmount }}</div>
      <div v-if="!isShort">{{ totalIncomeCurrencyAmount }}</div>
      <div class="Typo_BodyAccent">{{ incomeFromProductsCurrencyAmount }}</div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_income">
      <div v-if="!isShort">{{ incomeFromProducts }}</div>
      <div v-if="!isShort">{{ incomeFromServices }}</div>
      <div class="Typo_BodyAccent">{{ totalIncome }}</div>
    </div>
    <div class="ReportTableRow_Column ReportTableRow_Column_type_actions">
      <ReportTableRowButton :size="size" icon="edit" label="Изменить" @click="emit('edit', index)" />
      <ReportTableRowButton :size="size" icon="copy" label="Копировать" @click="emit('copy', index)" />
      <ReportTableRowButton :size="size" icon="trash" label="Удалить" @click="emit('remove', index)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ReportTableRow {
  display: grid;
  grid-template-columns: 50px auto 60px 90px 130px 150px;
  background: var(--color-background-surface-accent);

  &_even {
    background: var(--color-background-surface);
  }

  &_short {
    .ReportTableRow_Description {
      -webkit-line-clamp: 1;
      .ReportTableRow_Tag {
        float: right;
        margin-left: 10px;
      }
    }
    .ReportTableRow_Column_type_actions {
      flex-direction: row;
    }
  }

  &_Description {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    width: 100%;
  }

  &_Tag {
    float: right;
    margin-left: 10px;
  }

  &_Column {
    padding: 8px;

    &_type {
      &_number {
        text-align: center;
        font-weight: 600;
      }

      &_description {
      }

      &_income {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }

      &_actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
      }
    }

    &_font_secondary {
      color: var(--color-text-placeholder);
    }
  }
}
</style>
