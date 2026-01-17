import { createRouter, createWebHistory } from 'vue-router'

//todo: пример из https://router.vuejs.org/guide/ - заменить
/*import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]*/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router
