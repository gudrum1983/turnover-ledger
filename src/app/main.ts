import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vMaska } from 'maska/vue'
import { trackVisit, vAutofocus } from '@/shared/lib'

import './styles/main.css'

import App from './App.vue'
import router from './router'
import { useCurrencyStore } from '@/entities/currency'
import { useReportStore } from '@/entities/report'
import { i18n, useLocaleStore } from '@/shared/i18n'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(i18n)
app.use(router)
app.directive('maska', vMaska)
app.directive('autofocus', vAutofocus)

useReportStore(pinia).hydrateFromLocalStorage()
const currencyStore = useCurrencyStore(pinia)
currencyStore.hydrateFromLocalStorage()
useLocaleStore(pinia).hydrateFromLocalStorage()

void currencyStore.loadCurrencies()

// Анонимная статистика посещений: не чаще раза в день с браузера, без идентификаторов.
trackVisit()

app.mount('#app')
