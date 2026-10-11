<script setup lang="ts">
import { LinkBase } from '../link-base'

type Props = {
  /** Email-адрес для mailto-ссылки */
  email: string
}

const { email } = defineProps<Props>()
</script>

<template>
  <LinkBase :href="`mailto:${email}`" class="LinkEmail">
    <slot>{{ email }}</slot>
  </LinkBase>
</template>
