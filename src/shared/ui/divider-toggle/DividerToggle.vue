<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useLocale } from '@/shared/i18n'
import { DividerBase } from '@/shared/ui/divider-base'
import { ButtonBase } from '@/shared/ui/button-base'
import { IconChevron } from '@/shared/ui/icons'

type DividerLineStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'

type DividerColorToken =
  | 'base'
  | 'table'
  | 'default'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ring'
  | 'disabled'
  | 'table-cell'

type DividerLabelPosition = 'left' | 'center' | 'right'

type Props = {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  lineStyle?: DividerLineStyle
  color?: DividerColorToken
  thickness?: number
  labelPosition?: DividerLabelPosition
  labelOffset?: number
  edgeOffset?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false,
  labelPosition: 'left',
})
const { t } = useLocale()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'click', value: boolean): void
}>()

const slots = useSlots()
const hasIconSlot = computed(() => Boolean(slots.icon))
const hasIconActiveSlot = computed(() => Boolean(slots['icon-active']))

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const buttonAriaLabel = computed(() => {
  const action = isOpen.value ? t('ui.accessibility.collapseSection') : t('ui.accessibility.expandSection')

  return props.label ? `${action}: ${props.label}` : action
})

const handleClick = () => {
  if (props.disabled) return
  const next = !isOpen.value
  emit('click', next)
  isOpen.value = next
}
</script>

<template>
  <div class="DividerToggle" :class="{ DividerToggle_isOpen: isOpen }">
    <div class="DividerToggle_Header">
      <ButtonBase
        class="DividerToggle_Button"
        isIconOnly
        size="xs"
        type="button"
        :disabled="disabled"
        :aria-label="buttonAriaLabel"
        :aria-expanded="isOpen"
        @click="handleClick"
      >
        <template #icon>
          <slot v-if="isOpen && hasIconActiveSlot" name="icon-active" />
          <slot v-else-if="!isOpen && hasIconSlot" name="icon" />
          <IconChevron v-else-if="isOpen && !hasIconActiveSlot" class="DividerToggle_Icon_active" />
          <IconChevron v-else class="DividerToggle_Icon" />
        </template>
      </ButtonBase>

      <DividerBase
        class="DividerToggle_Divider"
        :label="label"
        :label-position="labelPosition"
        :line-style="lineStyle"
        :color="color"
        :thickness="thickness"
        :label-offset="labelOffset"
        :edge-offset="edgeOffset"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.DividerToggle {
  &_Header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &_Icon {
    width: 18px;
    height: 18px;
    &_active {
      width: 18px;
      height: 18px;
      transform: rotate(180deg);
    }
  }

  &_Divider {
    flex: 1 1 auto;
  }
}
</style>
