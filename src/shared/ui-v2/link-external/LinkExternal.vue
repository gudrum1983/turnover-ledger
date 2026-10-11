<script setup lang="ts">
import { LinkBase } from '../link-base'

type LinkExternalProps = {
  /** Внешний URL. */
  href: string
  /** Где открыть ссылку: _self — в текущей вкладке, _blank — в новой. */
  target?: '_self' | '_blank'
}

const { href, target = '_blank' } = defineProps<LinkExternalProps>()
</script>

<template>
  <LinkBase
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    class="LinkExternal"
  >
    <slot>{{ href }}</slot>
  </LinkBase>
</template>
