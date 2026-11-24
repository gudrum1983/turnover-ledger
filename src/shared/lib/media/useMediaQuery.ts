import { onScopeDispose, readonly, ref, type Ref } from 'vue'

// Совпадает ли медиа-запрос, реагирует на изменения. Значение вычисляется сразу при вызове,
// подписка снимается вместе с компонентом (или effect scope). Без window (тесты) — false.
export function useMediaQuery(query: string): Readonly<Ref<boolean>> {
  if (typeof window === 'undefined') {
    return readonly(ref(false))
  }

  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)
  const update = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  mediaQuery.addEventListener('change', update)
  onScopeDispose(() => mediaQuery.removeEventListener('change', update))

  return readonly(matches)
}

/**
 * Сенсорный режим: основное устройство ввода — палец (телефон, планшет).
 * Ноутбук с сенсорным экраном, которым работают тачпадом, сюда не попадает.
 */
export function useTouchMode(): Readonly<Ref<boolean>> {
  return useMediaQuery('(pointer: coarse)')
}
