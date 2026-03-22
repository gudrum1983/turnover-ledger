<script setup lang="ts">
import { computed } from 'vue'
import { ButtonGroup } from '@/shared/ui/button-group'
import { useLocale } from '@/shared/i18n'
import type { ReportScript } from '@/shared/types/report.ts'

type Props = {
  modelValue: ReportScript
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ReportScript): void
}>()

const { t } = useLocale()

const options = computed(() => [
  { value: 'srLat', label: t('ui.languageSwitcher.reportScriptLatin') },
  { value: 'srCyr', label: t('ui.languageSwitcher.reportScriptCyrillic') },
])

const model = computed<string>({
  get: () => props.modelValue,
  set: (value) => {
    if (value === 'srLat' || value === 'srCyr') {
      emit('update:modelValue', value)
    }
  },
})
</script>

<template>
  <div class="ReportScriptToggle">
    <div class="Typo_Caption">{{ t('ui.languageSwitcher.reportScript') }}:</div>
    <ButtonGroup v-model="model" :options="options" :aria-label="t('ui.languageSwitcher.reportScript')" size="xs" />
  </div>
</template>

<style scoped lang="scss">
.ReportScriptToggle {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
