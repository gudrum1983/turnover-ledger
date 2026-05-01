import type { DirectiveBinding, ObjectDirective } from 'vue'

const FOCUSABLE_SELECTOR =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

function isVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0
}

function resolveTarget(element: HTMLElement): HTMLElement | null {
  if (element.matches(FOCUSABLE_SELECTOR)) {
    return element
  }

  return element.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
}

function focusWithRetry(element: HTMLElement, binding: DirectiveBinding<boolean | undefined>, attempt = 0): void {
  if (binding.value === false) {
    return
  }

  const target = resolveTarget(element)

  if (target && isVisible(target)) {
    target.focus()
    return
  }

  if (attempt < 5) {
    requestAnimationFrame(() => {
      focusWithRetry(element, binding, attempt + 1)
    })
  }
}

const vAutofocus: ObjectDirective<HTMLElement, boolean | undefined> = {
  mounted(element, binding) {
    focusWithRetry(element, binding)
  },
  updated(element, binding) {
    if (binding.value === false) {
      return
    }

    if (binding.oldValue === binding.value) {
      return
    }

    focusWithRetry(element, binding)
  },
}

export default vAutofocus
