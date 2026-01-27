import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vMaska } from 'maska/vue'

import './styles/main.css'

import App from './App.vue'
import router from './router'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'
import { useCurrencyStore } from '@/app/stores/currencyStore.ts'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('maska', vMaska)

useMetaDataStore(pinia).hydrateFromLocalStorage()
const currencyStore = useCurrencyStore(pinia)
currencyStore.hydrateFromLocalStorage()

void currencyStore.loadCurrencies()

app.mount('#app')
