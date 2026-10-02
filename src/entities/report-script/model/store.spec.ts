import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useReportScriptStore } from './store'

describe('useReportScriptStore', () => {
  const getItem = vi.fn()
  const setItem = vi.fn()

  beforeEach(() => {
    setActivePinia(createPinia())
    getItem.mockReset()
    setItem.mockReset()
    vi.stubGlobal('localStorage', { getItem, setItem })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('shares changes between header and preview and persists them', async () => {
    const header = useReportScriptStore()
    const preview = useReportScriptStore()
    header.setScript('srCyr')
    expect(preview.script).toBe('srCyr')
    await nextTick()
    expect(setItem).toHaveBeenLastCalledWith('report-script', 'srCyr')
    preview.script = 'srLat'
    expect(header.script).toBe('srLat')
    await nextTick()
    expect(setItem).toHaveBeenLastCalledWith('report-script', 'srLat')
  })

  it('restores saved script', () => {
    getItem.mockReturnValue('srCyr')
    expect(useReportScriptStore().script).toBe('srCyr')
  })

  it('falls back for an invalid stored value', () => {
    getItem.mockReturnValue('invalid')
    expect(useReportScriptStore().script).toBe('srLat')
  })

  it('uses the default when no preference is saved', () => {
    expect(useReportScriptStore().script).toBe('srLat')
    expect(setItem).toHaveBeenCalledWith('report-script', 'srLat')
  })
})
