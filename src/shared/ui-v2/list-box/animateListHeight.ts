// Плавно меняет высоту списка со старой на новую (при раскрытии «Ещё»), как при открытии меню.
// Переход к height: auto умеют не все браузеры, поэтому новую высоту замеряем и ставим явно, а после — убираем.
// Вызывать после того, как список перерисовался (в nextTick), передав высоту до изменения.
export function animateListHeight(element: HTMLElement | undefined, fromHeight: number | undefined) {
  if (!element || !fromHeight) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const toHeight = element.offsetHeight
  if (toHeight === fromHeight) return

  // transitionend всплывает и от пунктов (у них свои переходы при наведении) — ждём именно высоту списка.
  const cleanup = (event: TransitionEvent) => {
    if (event.target !== element || event.propertyName !== 'height') return
    element.removeEventListener('transitionend', cleanup)
    element.style.height = ''
    element.style.transition = ''
  }
  element.style.height = `${fromHeight}px`
  void element.offsetHeight // применяем стартовую высоту до перехода
  element.style.transition = 'height var(--transition-collapse-enter)'
  element.style.height = `${toHeight}px`
  element.addEventListener('transitionend', cleanup)
}
