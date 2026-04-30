<script setup lang="ts">
type Props = {
  /** Email-адрес для mailto-ссылки */
  email: string
  /** Размер шрифта ссылки */
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const { email, size = 'md' } = defineProps<Props>()

const sizeClass = `LinkEmail_size_${size}`
</script>

<template>
  <a :href="`mailto:${email}`" class="LinkEmail" :class="sizeClass">
    <slot>{{ email }}</slot>
  </a>
</template>

<style scoped lang="scss">
.LinkEmail {
  --link-font-size: var(--font-medium-text-base);
  --link-color: var(--color-text-link);
  --link-color-hover: var(--color-text-link-hovered);

  cursor: pointer;
  padding: 0;
  margin: 0;
  font: var(--link-font-size);
  color: var(--link-color);
  text-decoration: none;
  transition: all var(--transition);

  &:hover {
    color: var(--link-color-hover);
    text-decoration: underline;
  }

  &_size {
    &_xs {
      --link-font-size: var(--font-medium-text-sm);
    }

    &_sm {
      --link-font-size: var(--font-medium-text-sm);
    }

    &_md {
      --link-font-size: var(--font-medium-text-base);
    }

    &_lg {
      --link-font-size: var(--font-medium-text-lg);
    }
  }
}
</style>
