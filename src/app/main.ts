import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vMaska } from 'maska/vue'

import './styles/main.css'

import App from './App.vue'
import router from './router'
import { useMetaDataStore } from '@/app/stores/metaDataStore.ts'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('maska', vMaska)

useMetaDataStore(pinia).hydrateFromLocalStorage()

app.mount('#app')
