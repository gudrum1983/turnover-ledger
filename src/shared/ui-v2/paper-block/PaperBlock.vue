<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  /** Управляет видимостью модального окна */
  variant: 'default' | 'meta' | 'info'
}

const { variant = 'default' } = defineProps<Props>()

const classes = computed(() => [`PaperBlock_variant_${variant}`])
</script>

<template>
  <div class="PaperBlock" :class="classes">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.PaperBlock {
  border-radius: 32px;
  padding: 40px 30px;
  background: var(--white);
  box-shadow: 0 4px 16px 0 #0000000a;
}

.PaperBlock_variant_default {
  background: var(--white);

  border: 1px solid var(--neutral-200);
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
