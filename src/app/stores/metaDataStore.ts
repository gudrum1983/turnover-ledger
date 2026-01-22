import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { STORE_NAME } from '@/shared/constants/nameStore.ts'
import type { FooterField, HeaderField } from '@/shared/constants/reportFields.ts'

//todo: создан автоматически - заменить

export const useMetaDataStore = defineStore(STORE_NAME.MetaData, () => {
  /* деструктуризация из хранилища - в компонентеconst { name, doubleCount } = storeToRefs(store)*/

  /* header */
  const pib = ref('')
  const taxpayer = ref('')
  const companyName = ref('')
  const address = ref('')
  const taxNumber = ref('')
  const activityCode = ref('')
  /* footer */
  const preparedBy = ref('')
  const responsiblePerson = ref('')

  const formData = computed(() => ({
    header: {
      pib: pib.value,
      taxpayer: taxpayer.value,
      companyName: companyName.value,
      address: address.value,
      taxNumber: taxNumber.value,
      activityCode: activityCode.value,
    },
    footer: {
      preparedBy: preparedBy.value,
      responsiblePerson: responsiblePerson.value,
    },
  }))

  /*можно передавать расчитанные значения*/
  /*  const doubleCount = computed(() => count.value * 2)*/
  const taxpayerUppercase = computed(() => taxpayer.value.toUpperCase() + 'Заглавными буквами')

  function setHeaderValue(field: HeaderField, value: string) {
    if (field === 'pib') {
      pib.value = value
    }
    if (field === 'taxpayer') {
      taxpayer.value = value
    }
    if (field === 'companyName') {
      companyName.value = value
    }
    if (field === 'address') {
      address.value = value
    }
    if (field === 'taxNumber') {
      taxNumber.value = value
    }
    if (field === 'activityCode') {
      activityCode.value = value
    }
    return
  }

  function setFooterValue(field: FooterField, value: string) {
    if (field === 'preparedBy') {
      preparedBy.value = value
    }
    if (field === 'responsiblePerson') {
      responsiblePerson.value = value
    }
    return
  }

  return { formData, taxpayerUppercase, setHeaderValue, setFooterValue }
})
