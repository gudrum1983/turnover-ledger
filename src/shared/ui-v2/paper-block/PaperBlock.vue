<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  /** Фон поверхности: default — белый, meta — градиент с рисунком, info — градиент */
  variant: 'default' | 'meta' | 'info'
  /** Убирает внутренние отступы */
  noPadding?: boolean
  overflow?: 'clip' | 'scroll' | 'auto'
}

const { variant = 'default', noPadding = false, overflow } = defineProps<Props>()

const classes = computed(() => [
  `PaperBlock_variant_${variant}`,
  { PaperBlock_noPadding: noPadding },
  overflow && `PaperBlock_overflow_${overflow}`,
])
</script>

<template>
  <div class="PaperBlock" :class="classes">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.PaperBlock {
  --radius-paper-block: 32px;
  --border-width-paper-block: 0px;
  // Внутренний радиус для потомков, прижатых к краю блока (например, футер таблицы с фоном).
  // Наследуется вниз по дереву, поэтому блок не нужно обрезать через overflow.
  --radius-paper-block-inner: calc(var(--radius-paper-block) - var(--border-width-paper-block));
  // Отступы — переменными: потомок может выйти к краям блока (например, липкая шапка во всю ширину).
  --paper-block-padding-block: 40px;
  --paper-block-padding-inline: 30px;

  border-radius: var(--radius-paper-block);
  padding: var(--paper-block-padding-block) var(--paper-block-padding-inline);
  background: var(--white);
  box-shadow: 0 4px 16px 0 #0000000a;
}

.PaperBlock_noPadding {
  --paper-block-padding-block: 0px;
  --paper-block-padding-inline: 0px;
}

.PaperBlock_overflow_clip {
  overflow: clip;
}

.PaperBlock_overflow_scroll {
  overflow: scroll;
}

.PaperBlock_overflow_auto {
  overflow: auto;
}

.PaperBlock_variant_default {
  --border-width-paper-block: 1px;

  background: var(--white);
  border: var(--border-width-paper-block) solid var(--neutral-200);
}

.PaperBlock_variant_meta {
  background-image:
    url('./paper-block-bg.svg'),
    linear-gradient(
      328.15deg,
      #d5dfe2 34.09%,
      rgba(215, 225, 222, 0.8) 63.26%,
      rgba(220, 231, 213, 0.6) 81.94%,
      rgba(236, 247, 184, 0.6) 95.8%,
      #f3feac 104.21%
    );
  background-position:
    calc(100% + 320px) calc(100% + 320px),
    center;
  background-size:
    640px 640px,
    auto;
  background-repeat: no-repeat;

  box-shadow: 0 4px 16px 0 #0000000a;
}

.PaperBlock_variant_info {
  background-image: linear-gradient(
    328.15deg,
    #d5dfe2 34.09%,
    rgba(215, 225, 222, 0.8) 63.26%,
    rgba(220, 231, 213, 0.6) 81.94%,
    rgba(236, 247, 184, 0.6) 95.8%,
    #f3feac 104.21%
  );
}
</style>
