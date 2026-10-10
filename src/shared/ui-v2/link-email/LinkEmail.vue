<script setup lang="ts">
type Props = {
  /** Email-адрес для mailto-ссылки */
  email: string
}

const { email } = defineProps<Props>()
</script>

<template>
  <a :href="`mailto:${email}`" class="LinkEmail">
    <slot>{{ email }}</slot>
  </a>
</template>

<style scoped lang="scss">
.LinkEmail {
  --link-color: var(--blue-300);
  --link-color-hover: var(--blue-600);
  border-radius: 8px;
  padding: 2px 6px;
  cursor: pointer;
  margin: 0;
  color: var(--link-color);
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px #c5cecf66;
    color: var(--link-color-hover);
  }
}
</style>
