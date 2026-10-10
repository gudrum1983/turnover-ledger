<script setup lang="ts">
type LinkExternalProps = {
  /** Внешний URL. */
  href: string
  /** Где открыть ссылку: _self — в текущей вкладке, _blank — в новой. */
  target?: '_self' | '_blank'
}

const { href, target = '_blank' } = defineProps<LinkExternalProps>()
</script>

<template>
  <a :href="href" :target="target" :rel="target === '_blank' ? 'noopener noreferrer' : undefined" class="LinkExternal">
    <slot>{{ href }}</slot>
  </a>
</template>

<style scoped lang="scss">
.LinkExternal {
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
