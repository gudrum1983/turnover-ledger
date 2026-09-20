<script setup lang="ts">
import { computed } from 'vue'
import ButtonBase from '../button-base/ButtonBase.vue'
import type { ButtonProps, ButtonSize } from '../button-base/types'
import type { IconSize } from '../icons/sizes'
import { LoaderBase } from '../loader-base'

type Props = ButtonProps & {
  /** Показывает индикатор загрузки вместо иконки */
  loading?: boolean
}

const { size = 'l', loading = false, ...props } = defineProps<Props>()
const ICON_SIZES = {
  l: { dimension: 22, icon: 'l', loader: 'm' },
  m: { dimension: 18, icon: 'm', loader: 's' },
} as const satisfies Record<ButtonSize, { dimension: number; icon: IconSize; loader: 's' | 'm' }>

const sizeConfig = computed(() => ICON_SIZES[size])
const iconDimension = computed(() => `${sizeConfig.value.dimension}px`)
</script>

<template>
  <ButtonBase class="ButtonWithIcon" v-bind="props" :size="size" :aria-busy="loading || undefined">
    <template #content="{ labelClasses }">
      <span class="ButtonWithIcon_Content">
        <span class="ButtonWithIcon_Icon" aria-hidden="true">
          <LoaderBase v-if="loading" :size="sizeConfig.loader" />
          <slot v-else name="icon" :size="sizeConfig.icon" />
        </span>
        <span :class="labelClasses"><slot /></span>
      </span>
    </template>
  </ButtonBase>
</template>

<style scoped lang="scss">
.ButtonWithIcon_Content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ButtonWithIcon_Icon {
  width: v-bind(iconDimension);
  height: v-bind(iconDimension);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
