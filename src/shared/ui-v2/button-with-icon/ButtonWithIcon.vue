<script setup lang="ts">
import { computed, type Component } from 'vue'
import ButtonBase from '../button-base/ButtonBase.vue'
import type { ButtonProps, ButtonSize } from '../button-base/types'
import type { IconSize } from '../icons/sizes'
import { LoaderBase } from '../loader-base'

type Props = ButtonProps & {
  /** Компонент иконки; размер задаётся кнопкой */
  icon: Component
  /** Показывает индикатор загрузки вместо иконки */
  loading?: boolean
}

const { size = 'l', loading = false, icon, ...props } = defineProps<Props>()
const ICON_SIZES = {
  l: { dimension: 22, icon: 'l', loader: 'm' },
  m: { dimension: 18, icon: 'm', loader: 's' },
} as const satisfies Record<ButtonSize, { dimension: number; icon: IconSize; loader: 's' | 'm' }>

const sizeConfig = computed(() => ICON_SIZES[size])
const iconDimension = computed(() => `${sizeConfig.value.dimension}px`)
</script>

<template>
  <ButtonBase class="ButtonWithIcon" v-bind="props" :size="size" :aria-busy="loading || undefined">
    <span class="ButtonWithIcon-Icon" aria-hidden="true">
      <LoaderBase v-if="loading" :size="sizeConfig.loader" />
      <component :is="icon" v-else :size="sizeConfig.icon" />
    </span>
    <slot />
  </ButtonBase>
</template>

<style scoped lang="scss">
.ButtonWithIcon-Icon {
  width: v-bind(iconDimension);
  height: v-bind(iconDimension);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
