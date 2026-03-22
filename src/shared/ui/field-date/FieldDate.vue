<script setup lang="ts">
import { computed } from 'vue'
import { type InputAttributesConfig, VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useLocaleStore } from '@/app/stores/localeStore.ts'

type Props = {
  name: string
  label?: string
  modelValue: string | null
  fullWidth?: boolean
  required?: boolean
}

const { name, label, modelValue, fullWidth = false, required = false } = defineProps<Props>()

const inputConfig: Partial<InputAttributesConfig> = {
  name: name,
  required: required,
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const localeStore = useLocaleStore()
const inputClassName = computed(() =>
  fullWidth ? 'FieldDate_Input FieldDate_FullWidth' : 'FieldDate_Input',
)
</script>

<template>
  <label class="FieldDate Typo_Caption">
    {{ label }}
    <VueDatePicker
      :model-value="modelValue"
      :name="name"
      :input-attrs="inputConfig"
      :year-range="[2012, new Date().getFullYear()]"
      :min-date="new Date(2020, 0, 1)"
      :max-date="new Date()"
      placeholder="DD.MM.YYYY"
      text-input
      :locale="localeStore.dateFnsLocale"
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

.FieldDate_FullWidth {
  width: 100%;
}

:deep(.FieldDate_Input:hover) {
  border-color: var(--color-border-primary);
}

:deep(.FieldDate_Input::placeholder) {
  color: var(--color-text-placeholder);
}
</style>
