<script setup lang="ts">
import { computed } from 'vue'
import { Translation } from 'vue-i18n'
import { useReportStore } from '@/entities/report'
import { ButtonDropdown, type DropdownTypography, type DropdownPlacement } from '@/shared/ui-v2/button-dropdown'
import { useReportYearOptions } from '../model/useReportYearOptions'

withDefaults(
  defineProps<{
    size?: 'compact' | 'middle' | 'full'
    typography?: DropdownTypography
    placement?: DropdownPlacement
  }>(),
  {
    size: 'full',
    typography: 'body-m',
    placement: 'right',
  },
)

const store = useReportStore()
const { options } = useReportYearOptions()

const model = computed({
  get: () => String(store.activeYear),
  set: (value: string) => {
    const option = options.value.find((option) => option.value === value)
    if (option) store.setActiveYear(option.year)
  },
})
</script>

<template>
  <ButtonDropdown v-model="model" :options="options" :typography="typography" :placement="placement">
    <template #label>
      <span v-if="size === 'compact'" class="ReportYearSelect_Year">{{ model }}</span>
      <Translation
        v-else
        :keypath="size === 'middle' ? 'ui.reportYearSelect.buttonMiddleLabel' : 'ui.reportYearSelect.buttonLabel'"
        scope="global"
        tag="span"
        class="ReportYearSelect_Label"
      >
        <template #year>
          <span class="ReportYearSelect_Year">{{ model }}</span>
        </template>
      </Translation>
    </template>
  </ButtonDropdown>
</template>

<style scoped lang="scss">
.ReportYearSelect_Label {
  text-transform: lowercase;
}

.ReportYearSelect_Year {
  display: inline-block;
  min-width: 40px;
  font-variant-numeric: tabular-nums;
}
</style>
