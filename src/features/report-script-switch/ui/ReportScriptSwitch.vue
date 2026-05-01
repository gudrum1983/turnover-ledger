<script setup lang="ts">
import { computed } from 'vue'
import { ButtonGroup } from '@/shared/ui/button-group'
import { useLocale } from '@/shared/i18n'
import type { ReportScript } from '@/entities/report'

type Props = {
  modelValue: ReportScript
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ReportScript): void
}>()

const { t } = useLocale()

const options = computed(() => [
  { value: 'srLat', label: t('ui.reportPreviewScriptSwitcher.latin') },
  { value: 'srCyr', label: t('ui.reportPreviewScriptSwitcher.cyrillic') },
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
  <div class="ReportScriptSwitch">
    <div class="Typo_Caption">{{ t('ui.reportPreviewScriptSwitcher.label') }}:</div>
    <ButtonGroup v-model="model" :options="options" :aria-label="t('ui.reportPreviewScriptSwitcher.label')" size="xs" />
  </div>
</template>

<style scoped lang="scss">
.ReportScriptSwitch {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
