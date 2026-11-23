<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/shared/i18n'
import { ModalBase } from '@/shared/ui-v2/modal-base'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { CheckboxBase } from '@/shared/ui-v2/checkbox-base'
import { DividerBase } from '@/shared/ui-v2/divider-base'
import { IconDangerCircle, IconInfoCircle } from '@/shared/ui-v2/icons'

export type DataTransferYearItem = {
  year: number
  label: string
  /** Год нельзя выбрать (например, при импорте — его нет в файле) */
  disabled?: boolean
}

// Окно импорта и экспорта по макету Figma «DataTransferModal»: годы с галочками, «Выбрать все»,
// общая галочка «Реквизиты», предупреждение и кнопки.
const {
  title,
  fileName,
  subtitle,
  warnings = [],
  summary,
  confirmLabel,
  items,
  metaLabel,
  metaDisabled = false,
} = defineProps<{
  title: string
  /** Имя файла под заголовком (при импорте) */
  fileName?: string
  /** Заголовок списка годов */
  subtitle: string
  /** Предупреждения над кнопками — жёлтым, с восклицательным знаком */
  warnings?: string[]
  /** Итог: что произойдёт по отмеченным галочкам — серым, с «i» */
  summary?: string | null
  /** Текст основной кнопки */
  confirmLabel: string
  /** Годы, от нового к старому */
  items: DataTransferYearItem[]
  /** Подпись галочки реквизитов, например «Реквизиты - в книге заполнены, в файле нет» */
  metaLabel: string
  /** Реквизитов нет — галочка неактивна */
  metaDisabled?: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const selectedYears = defineModel<number[]>('years', { required: true })
const includeMeta = defineModel<boolean>('meta', { required: true })

const emit = defineEmits<{
  (event: 'confirm'): void
}>()

const { t } = useLocale()

const selectableYears = computed(() => items.filter((item) => !item.disabled).map(({ year }) => year))
const isAllSelected = computed(
  () => selectableYears.value.length > 0 && selectableYears.value.every((year) => selectedYears.value.includes(year)),
)
const isPartlySelected = computed(() => selectedYears.value.length > 0 && !isAllSelected.value)
const canConfirm = computed(() => selectedYears.value.length > 0 || includeMeta.value)

function toggleAll(value: boolean) {
  selectedYears.value = value ? [...selectableYears.value] : []
}

function toggleYear(year: number, value: boolean) {
  const others = selectedYears.value.filter((item) => item !== year)
  selectedYears.value = value ? [...others, year] : others
}
</script>

<template>
  <ModalBase
    :open="open"
    :title="title"
    has-close-button
    should-close-on-overlay
    should-close-on-esc
    @update:open="open = $event"
  >
    <div class="ReportDataTransferModal">
      <p v-if="fileName" class="ReportDataTransferModal-File u-typo-body-m">
        {{ t('ui.dataTransferModal.file', { name: fileName }) }}
      </p>

      <div class="ReportDataTransferModal-Selection">
        <p class="ReportDataTransferModal-Subtitle u-typo-subtitle-l">{{ subtitle }}</p>
        <!-- Без годов для выбора (например, в файле нет подходящих записей) «Выбрать все» неактивна, как в макете. -->
        <CheckboxBase
          v-if="selectableYears.length !== 1"
          class="ReportDataTransferModal-Option"
          :model-value="isAllSelected"
          :indeterminate="isPartlySelected"
          :disabled="selectableYears.length === 0"
          @update:model-value="toggleAll"
        >
          {{ t('ui.dataTransferModal.selectAll') }}
        </CheckboxBase>
        <DividerBase />
        <template v-if="items.length > 0">
          <div class="ReportDataTransferModal-Years">
            <CheckboxBase
              v-for="item in items"
              :key="item.year"
              class="ReportDataTransferModal-Option"
              :model-value="selectedYears.includes(item.year)"
              :disabled="item.disabled"
              @update:model-value="toggleYear(item.year, $event)"
            >
              {{ item.label }}
            </CheckboxBase>
          </div>
          <DividerBase />
        </template>
      </div>

      <CheckboxBase v-model="includeMeta" class="ReportDataTransferModal-Option" :disabled="metaDisabled">
        {{ metaLabel }}
      </CheckboxBase>

      <DividerBase />
      <div v-if="warnings.length > 0 || summary" class="ReportDataTransferModal-Notes">
        <p
          v-for="warning in warnings"
          :key="warning"
          class="ReportDataTransferModal-Note ReportDataTransferModal-Note_warning u-typo-body-small-m"
        >
          <IconDangerCircle class="ReportDataTransferModal-NoteIcon" size="s" />
          {{ warning }}
        </p>
        <p v-if="summary" class="ReportDataTransferModal-Note u-typo-body-small-m" aria-live="polite">
          <IconInfoCircle class="ReportDataTransferModal-NoteIcon" size="s" />
          {{ summary }}
        </p>
      </div>

      <div class="ReportDataTransferModal-Actions">
        <div class="ReportDataTransferModal-Buttons">
          <ButtonBase
            class="ReportDataTransferModal-Confirm"
            variant="accent"
            :disabled="!canConfirm"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </ButtonBase>
          <ButtonBase class="ReportDataTransferModal-Cancel" variant="page" @click="open = false">
            {{ t('ui.dataTransferModal.cancel') }}
          </ButtonBase>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<style scoped lang="scss">
// Отступы и типографика — по макету Figma «DataTransferModal».
.ReportDataTransferModal {
  // Высота пункта списка: строка 21px + отступы 10px сверху и снизу.
  --transfer-option-height: 41px;
  --transfer-options-gap: 2px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  // Имя файла стоит под заголовком окна: отступ 8px вместо 24px у шапки ModalBase.
  &-File {
    margin: -16px 0 0;
    color: var(--neutral-700);
    overflow-wrap: anywhere;
  }

  &-Selection {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-Subtitle {
    margin: 0;
    color: var(--neutral-700);
  }

  &-Option {
    padding: 10px 16px;
  }

  // Пять пунктов, дальше — прокрутка.
  &-Years {
    display: flex;
    flex-direction: column;
    gap: var(--transfer-options-gap);
    max-height: calc(var(--transfer-option-height) * 5 + var(--transfer-options-gap) * 4);
    overflow-y: auto;
    padding-left: 16px;
  }

  &-Notes {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  // Итог — спокойным серым; предупреждение — жёлтым, как в макете.
  &-Note {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 0;
    color: var(--neutral-700);

    &_warning {
      color: var(--orange-400);

      .ReportDataTransferModal-NoteIcon {
        color: var(--yellow-600);
      }
    }
  }

  &-NoteIcon {
    flex-shrink: 0;
  }

  &-Actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-Buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  &-Confirm {
    flex: 1 1 200px;
  }

  &-Cancel {
    flex: 0 1 206px;
  }
}
</style>
