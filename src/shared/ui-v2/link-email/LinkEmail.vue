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
  --link-color: var(--blue-200);
  --link-color-hover: var(--blue-600);

  cursor: pointer;
  padding: 0;
  margin: 0;
  color: var(--link-color);
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
  }
}
</style>
