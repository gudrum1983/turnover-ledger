import { onScopeDispose, readonly, ref } from 'vue'

// Пороги ширины экрана (min-width). Значения совпадают с макетами:
// tablet — $bp-md из tokens/_container.scss, desktop — порог, на котором AppHeader переходит в размер l.
export const VIEWPORT_BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const

export type Viewport = 'mobile' | 'tablet' | 'desktop'

export function getViewportByWidth(width: number): Viewport {
  if (width >= VIEWPORT_BREAKPOINTS.desktop) return 'desktop'
  if (width >= VIEWPORT_BREAKPOINTS.tablet) return 'tablet'
  return 'mobile'
}

// Текущий тип экрана, реагирует на изменение ширины окна.
// Значение вычисляется сразу при вызове, поэтому при первой отрисовке нет «мигания» десктопной вёрстки.
// Подписки снимаются автоматически вместе с компонентом (или effect scope), в котором вызван composable.
export function useViewport() {
  if (typeof window === 'undefined') {
    return readonly(ref<Viewport>('desktop'))
  }

  const viewport = ref<Viewport>(getViewportByWidth(window.innerWidth))
  const update = () => {
    viewport.value = getViewportByWidth(window.innerWidth)
  }

  const queries = Object.values(VIEWPORT_BREAKPOINTS).map((width) => window.matchMedia(`(min-width: ${width}px)`))
  queries.forEach((query) => query.addEventListener('change', update))

  onScopeDispose(() => {
    queries.forEach((query) => query.removeEventListener('change', update))
  })

  return readonly(viewport)
}
