<script setup lang="ts">
import { computed } from 'vue'
import { IconArrowDown } from '@/shared/ui-v2/icons'

type Props = {
  /** Состояние раскрытия секции */
  modelValue?: boolean
  /** Текст подписи рядом с разделителем */
  label?: string
  /** Текст для aria-label в состоянии "развернуть" */
  ariaExpandLabel?: string
  /** Текст для aria-label в состоянии "свернуть" */
  ariaCollapseLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'click', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const buttonAriaLabel = computed(() => {
  const action = isOpen.value ? props.ariaCollapseLabel : props.ariaExpandLabel

  return props.label ? `${action}: ${props.label}` : action
})

const handleClick = () => {
  const next = !isOpen.value
  emit('click', next)
  isOpen.value = next
}
</script>

<template>
  <button
    class="CollapseToggle"
    :aria-label="buttonAriaLabel"
    :aria-expanded="isOpen"
    @click="handleClick"
    :class="{ CollapseToggle_isOpen: isOpen }"
  >
    <span class="CollapseToggle-Label u-typo-label-m">Cкрыть</span>
    <div class="CollapseToggle-Tag">
      <IconArrowDown class="CollapseToggle-Icon" />
    </div>
  </button>
</template>

<style scoped lang="scss">
.CollapseToggle {
  padding: 8px 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  background: transparent;
  border: none;

  &_Header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-Tag {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: var(--neutral-400);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--transition-color);
  }

  &-Icon {
    width: 18px;
    height: 18px;
    transition: transform var(--transition-color);
  }

  &-Divider {
    flex: 1 1 auto;
  }

  &:hover {
    .CollapseToggle-Tag {
      background: var(--blue-200);
    }
  }

  &:active {
    .CollapseToggle-Tag {
      background: var(--blue-400);
      transition-duration: var(--transition-duration-active);
    }
  }

  &:focus-visible {
    outline: none;

    box-shadow: 0 0 0 3px #c5cecf66;
    .CollapseToggle-Tag {
      background: var(--blue-200);
    }
  }
}

.CollapseToggle_isOpen {
  .CollapseToggle-Icon {
    transform: scaleY(-1);
  }
}
</style>
