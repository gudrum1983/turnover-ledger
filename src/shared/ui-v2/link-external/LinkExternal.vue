<script setup lang="ts">
type LinkExternalProps = {
  /** Внешний URL. */
  href: string
  /** Где открыть ссылку: _self — в текущей вкладке, _blank — в новой. */
  target?: '_self' | '_blank'
}

const { href, target = '_self' } = defineProps<LinkExternalProps>()
</script>

<template>
  <a :href="href" :target="target" :rel="target === '_blank' ? 'noopener noreferrer' : undefined" class="LinkExternal">
    <slot>{{ href }}</slot>
  </a>
</template>

<style scoped lang="scss">
.LinkExternal {
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
