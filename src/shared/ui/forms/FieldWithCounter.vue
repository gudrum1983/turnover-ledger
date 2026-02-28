<script setup lang="ts">
import { computed } from 'vue'
import BaseField from './BaseField.vue'

type Props = {
  name: string
  label?: string
  placeholder?: string
  modelValue: string | null
  fullWidth?: boolean
  debounceMs?: number
  maxLength: number
}

const { name, label, placeholder, modelValue, fullWidth = false, debounceMs = 0, maxLength } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const currentLength = computed(() => modelValue?.length ?? 0)
</script>

<template>
  <div class="FieldWithCounter">
    <BaseField
      :name="name"
      :label="label ? `${label} (${currentLength}/${maxLength})` : ''"
      :placeholder="placeholder"
      :model-value="modelValue"
      :full-width="fullWidth"
      :debounce-ms="debounceMs"
      :max-length="maxLength"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.FieldWithCounter {
  width: 100%;
}

.FieldWithCounter_Count {
  display: block;
  margin-top: 4px;
  text-align: right;
  color: var(--color-text-secondary);
}
</style>
