import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/variables.css'
import './styles/typography.css'
import './styles/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
