<script setup lang="ts">
import { computed } from 'vue'
import type { Locale } from 'date-fns'
import { ru } from 'date-fns/locale'
import { type InputAttributesConfig, VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { InfoHint } from '@/shared/ui/info-hint'

type Props = {
  /** Имя поля для формы */
  name: string
  /** Подпись поля */
  label?: string
  /** Текст информационной подсказки рядом с label */
  hint?: string
  /** Текущее значение даты в строковом формате */
  modelValue: string | null
  /** Делает поле обязательным */
  required?: boolean
  /** Локаль для date-fns и календаря */
  dateFnsLocale?: Locale
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  dateFnsLocale: () => ru,
})

const inputConfig = computed<Partial<InputAttributesConfig>>(() => ({
  name: props.name,
  required: props.required,
}))

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const inputClassName = computed(() => 'FieldDate_Input')
</script>

<template>
  <label class="FieldDate">
    <div class="FieldDate_Label">
      <span class="FieldDate_LabelText Typo_Caption">{{ props.label }}</span>
      <InfoHint v-if="props.hint" :text="props.hint" />
    </div>
    <VueDatePicker
      :model-value="props.modelValue"
      :name="props.name"
      :input-attrs="inputConfig"
      :year-range="[2012, new Date().getFullYear()]"
      :min-date="new Date(2020, 0, 1)"
      :max-date="new Date()"
      placeholder="DD.MM.YYYY"
      text-input
      :locale="props.dateFnsLocale"
      model-type="yyyy-MM-dd"
      format="dd.MM.yyyy"
      :formats="{ input: 'dd.MM.yyyy' }"
      :ui="{ input: 'my-input-class', menu: 'my-menu' }"
      :time-config="{ enableTimePicker: false }"
      :input-class-name="inputClassName"
      :auto-apply="true"
      @update:modelValue="emit('update:modelValue', $event ?? null)"
    />
  </label>
</template>

<style scoped lang="scss">
.FieldDate {
  width: 100%;
  display: flex;
  flex-direction: column;

  &_Label {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &_LabelText {
    flex: 1 1 auto;
  }
}

:deep(.my-menu) {
  --dp-primary-color: var(--color-background-primary);
}

:deep(.my-input-class) {
  --dp-border-color: var(--color-border-default);
  --dp-menu-border-color: var(--color-border-default);
  --dp-border-color-hover: var(--color-border-primary);
  --dp-border-color-focus: var(--color-border-primary);
  font: var(--font-regular-text-sm);
  &:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
  }
}

:deep(.FieldDate_Input:hover) {
  border-color: var(--color-border-primary);
}

:deep(.FieldDate_Input::placeholder) {
  color: var(--color-text-placeholder);
}
</style>
