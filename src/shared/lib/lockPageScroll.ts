let lockCount = 0
let originalOverflow = ''

export function lockPageScroll(): () => void {
  const root = document.documentElement

  if (lockCount === 0) {
    originalOverflow = root.style.overflow
    root.style.overflow = 'hidden'
  }
  lockCount += 1

  let released = false
  return () => {
    if (released) return
    released = true
    lockCount -= 1

    if (lockCount === 0) {
      root.style.overflow = originalOverflow
    }
  }
}
