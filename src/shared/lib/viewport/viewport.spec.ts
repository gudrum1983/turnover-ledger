import { describe, expect, it } from 'vitest'
import { getViewportByWidth } from './viewport'

describe('getViewportByWidth', () => {
  it.each([
    [360, 'mobile'],
    [767, 'mobile'],
    [768, 'tablet'],
    [1023, 'tablet'],
    [1024, 'desktop'],
    [1920, 'desktop'],
  ])('%i px → %s', (width, expected) => {
    expect(getViewportByWidth(width)).toBe(expected)
  })
})
