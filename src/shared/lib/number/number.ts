export type ToPxStringOptions = {
  min?: number
  max?: number
}

export const toPxString = (value: number | undefined, options?: ToPxStringOptions): string => {
  const n = Number(value ?? 0)
  if (!Number.isFinite(n)) return '0px'

  if (!options) return `${n}px`

  const { min, max } = options
  if (min !== undefined && max !== undefined && min > max) return '0px'
  if (min !== undefined && max !== undefined && min === max) return `${min}px`

  const withMin = min === undefined ? n : Math.max(min, n)
  const withMax = max === undefined ? withMin : Math.min(max, withMin)

  return `${withMax}px`
}
