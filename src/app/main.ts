import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vMaska } from 'maska/vue'
import { vAutofocus } from '@/shared/lib'

import './styles/main.css'

import App from './App.vue'
import router from './router'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { useCurrencyStore } from '@/app/stores/currencyStore.ts'
import { useLocaleStore } from '@/app/stores/localeStore.ts'
import { i18n } from '@/shared/i18n'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(i18n)
app.use(router)
app.directive('maska', vMaska)
app.directive('autofocus', vAutofocus)

useMetaDataStore(pinia).hydrateFromLocalStorage()
const currencyStore = useCurrencyStore(pinia)
currencyStore.hydrateFromLocalStorage()
useLocaleStore(pinia).hydrateFromLocalStorage()

void currencyStore.loadCurrencies()

app.mount('#app')
