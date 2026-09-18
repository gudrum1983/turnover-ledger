export const ICON_SIZES = {
  s: { dimension: 16, strokeWidth: 1 },
  m: { dimension: 18, strokeWidth: 1.23 },
  l: { dimension: 22, strokeWidth: 1.5 },
  xl: { dimension: 24, strokeWidth: 1.5 },
} as const

export type IconSize = keyof typeof ICON_SIZES
