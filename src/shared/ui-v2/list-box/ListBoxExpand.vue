<script setup lang="ts">
// Строка «Ещё (N)» в конце свёрнутого списка (слот footer у ListBox).
// Ведёт себя как пункт списка: подсвечивается при навигации с клавиатуры.
defineProps<{
  /** Подсветка при навигации с клавиатуры */
  focused?: boolean
}>()

defineEmits<{
  (event: 'click'): void
}>()
</script>

<template>
  <button
    class="ListBoxExpand u-typo-body-m"
    :class="{ ListBoxExpand_focused: focused }"
    type="button"
    role="option"
    tabindex="-1"
    aria-selected="false"
    :data-active="focused"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ListBoxExpand {
  flex-shrink: 0;
  width: 100%;
  min-height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 24px;
  background: inherit;
  color: var(--neutral-600);
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--neutral-100);
    color: var(--neutral-900);
  }

  // Как подсветка пунктов ListBox при навигации с клавиатуры.
  &_focused {
    background: var(--neutral-100);
    color: var(--neutral-900);
    box-shadow: 0 0 0 3px #f5c96a99;
  }
}
</style>
