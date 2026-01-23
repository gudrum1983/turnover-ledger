import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import type { FooterField, HeaderField } from '@/shared/constants/reportFields.ts'

export const useMetaDataStore = defineStore(STORE_NAME.MetaData, () => {
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

  return { formData, setHeaderValue, setFooterValue }
})
