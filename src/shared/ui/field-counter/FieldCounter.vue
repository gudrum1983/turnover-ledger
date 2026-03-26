<script setup lang="ts">
import { computed } from 'vue'
import { FieldBase } from '../field-base'

type Props = {
  name: string
  label?: string
  placeholder?: string
  modelValue: string | null
  debounceMs?: number
  maxLength: number
}

const { name, label, placeholder, modelValue, debounceMs = 0, maxLength } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const currentLength = computed(() => modelValue?.length ?? 0)
</script>

<template>
  <FieldBase
    class="FieldCounter"
    :name="name"
    :label="label ? `${label} (${currentLength}/${maxLength})` : ''"
    :placeholder="placeholder"
    :model-value="modelValue"
    :debounce-ms="debounceMs"
    :max-length="maxLength"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

<style scoped lang="scss">
.FieldCounter {
  width: 100%;
}
</style>
