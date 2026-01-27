import { reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import type { FooterField, HeaderField } from '@/shared/constants/reportFields.ts'

export const useMetaDataStore = defineStore(STORE_NAME.MetaData, () => {
  const LOCAL_STORAGE_KEY = 'piniaState'

  const formData = reactive({
    header: {
      pib: '',
      taxpayer: '',
      companyName: '',
      address: '',
      taxNumber: '',
      activityCode: '',
    },
    footer: {
      preparedBy: '',
      responsiblePerson: '',
    },
  })

  function setHeaderValue(field: HeaderField, value: string) {
    formData.header[field] = value
  }

  function setFooterValue(field: FooterField, value: string) {
    formData.footer[field] = value
  }

  function hydrateFromLocalStorage() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!savedState) return

    try {
      const parsed = JSON.parse(savedState) as typeof formData

      if (parsed?.header) {
        for (const key of Object.keys(formData.header) as HeaderField[]) {
          const value = parsed.header[key]
          if (typeof value === 'string') formData.header[key] = value
        }
      }

      if (parsed?.footer) {
        for (const key of Object.keys(formData.footer) as FooterField[]) {
          const value = parsed.footer[key]
          if (typeof value === 'string') formData.footer[key] = value
        }
      }
    } catch {
      // ignore invalid data in localStorage
    }
  }

  watch(
    formData,
    (state) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    },
    { deep: true },
  )

  return { formData, setHeaderValue, setFooterValue, hydrateFromLocalStorage }
})
