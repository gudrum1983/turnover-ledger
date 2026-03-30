<script setup lang="ts">
import { computed } from 'vue'

import { ButtonBase } from '@/shared/ui/button-base'
import { IconCopy, IconEdit, IconTrash } from '@/shared/ui/icons'

type Props = {
  size: 'short' | 'full'
  icon?: 'edit' | 'trash' | 'copy'
  label?: string
}

const { size, icon = 'edit', label = 'Изменить' } = defineProps<Props>()

const configMap = {
  edit: {
    color: 'success',
    icon: IconEdit,
  },
  trash: {
    color: 'danger',
    icon: IconTrash,
  },
  copy: {
    color: 'primary',
    icon: IconCopy,
  },
} as const

const config = computed(() => configMap[icon])
</script>

<template>
  <ButtonBase
    class="ReportTableRowButton"
    :color="config.color"
    size="xs"
    :contentPosition="size !== 'short' ? 'left' : 'center'"
    fullWidth
    :isIconOnly="size === 'short'"
  >
    <template #icon>
      <component :is="config.icon" class="ReportTableRowButton_Icon" />
    </template>
    <template v-if="size === 'full'">
      <p class="ReportTableRowButton_Label">{{ label }}</p>
    </template>
  </ButtonBase>
</template>

<style scoped lang="scss">
.ReportTableRowButton {
  &_Icon {
    width: 18px;
    height: 18px;
  }

  &_Label {
    font: var(--font-medium-text-xs);
    text-transform: uppercase;
  }
}
</style>
