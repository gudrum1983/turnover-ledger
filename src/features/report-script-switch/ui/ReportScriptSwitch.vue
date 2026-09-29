<script setup lang="ts">
import { computed } from 'vue'
import { ButtonGroup } from '@/shared/ui/button-group'
import { useLocale } from '@/shared/i18n'
import { REPORT_SCRIPTS, REPORT_SCRIPT_LABEL_KEY, isReportScript, type ReportScript } from '@/entities/report-script'

type Props = {
  modelValue: ReportScript
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ReportScript): void
}>()

const { t } = useLocale()

const options = computed(() => REPORT_SCRIPTS.map((value) => ({ value, label: t(REPORT_SCRIPT_LABEL_KEY[value]) })))

const model = computed<string>({
  get: () => props.modelValue,
  set: (value) => {
    if (isReportScript(value)) {
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
