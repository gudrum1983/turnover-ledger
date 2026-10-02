<template>
  <div class="DividerBase" role="separator" aria-orientation="horizontal">
    <svg viewBox="0 0 592 3" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        d="M0 1.5C0 1.22329 0.462191 0.998439 1.03494 0.996504L296 0L590.965 0.996504C591.538 0.998439 592 1.22329 592 1.5C592 1.77671 591.538 2.00156 590.965 2.0035L296 3L1.03494 2.0035C0.462189 2.00156 0 1.77671 0 1.5Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.DividerBase {
  width: 100%;
  height: 3px;
  flex-shrink: 0;
  color: var(--divider-color, var(--neutral-300));

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
