<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const { size = 'md' } = defineProps<Props>()

const classes = computed(() => [`loader_size_${size}`])
</script>

<template>
  <span class="loader" :class="classes"></span>
</template>

<style scoped lang="scss">
.loader {
  --loader-size: 2.5px;

  font-size: var(--loader-size);
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  color: currentColor;
  text-indent: -9999em;
  animation: loaderDots 1.1s infinite ease;
  transform: translateZ(0);
}

.loader_size_xs {
  --loader-size: 3px;
}

.loader_size_sm {
  --loader-size: 3.25px;
}

.loader_size_md {
  --loader-size: 3.5px;
}

.loader_size_lg {
  --loader-size: 4px;
}

@keyframes loaderDots {
  0%,
  100% {
    box-shadow:
      0 -2.6em 0 0 currentColor,
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2),
      2.5em 0 0 0 rgb(from currentColor r g b / 0.2),
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.2),
      0 2.5em 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.2),
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.5),
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.7);
  }

  12.5% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.7),
      1.8em -1.8em 0 0 currentColor,
      2.5em 0 0 0 rgb(from currentColor r g b / 0.2),
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.2),
      0 2.5em 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.2),
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.5);
  }

  25% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.5),
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.7),
      2.5em 0 0 0 currentColor,
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.2),
      0 2.5em 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.2),
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2);
  }

  37.5% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.2),
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.5),
      2.5em 0 0 0 rgb(from currentColor r g b / 0.7),
      1.75em 1.75em 0 0 currentColor,
      0 2.5em 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.2),
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2);
  }

  50% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.2),
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2),
      2.5em 0 0 0 rgb(from currentColor r g b / 0.5),
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.7),
      0 2.5em 0 0 currentColor,
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.2),
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2);
  }

  62.5% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.2),
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2),
      2.5em 0 0 0 rgb(from currentColor r g b / 0.2),
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.5),
      0 2.5em 0 0 rgb(from currentColor r g b / 0.7),
      -1.8em 1.8em 0 0 currentColor,
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2);
  }

  75% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.2),
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2),
      2.5em 0 0 0 rgb(from currentColor r g b / 0.2),
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.2),
      0 2.5em 0 0 rgb(from currentColor r g b / 0.5),
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.7),
      -2.6em 0 0 0 currentColor,
      -1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2);
  }

  87.5% {
    box-shadow:
      0 -2.6em 0 0 rgb(from currentColor r g b / 0.2),
      1.8em -1.8em 0 0 rgb(from currentColor r g b / 0.2),
      2.5em 0 0 0 rgb(from currentColor r g b / 0.2),
      1.75em 1.75em 0 0 rgb(from currentColor r g b / 0.2),
      0 2.5em 0 0 rgb(from currentColor r g b / 0.2),
      -1.8em 1.8em 0 0 rgb(from currentColor r g b / 0.5),
      -2.6em 0 0 0 rgb(from currentColor r g b / 0.7),
      -1.8em -1.8em 0 0 currentColor;
  }

  to {
    transform: translateZ(0);
  }
}
</style>
