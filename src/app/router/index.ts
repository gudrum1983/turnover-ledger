import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/shared/variables/routes.ts'

const routes = [
  {
    path: ROUTES.notFoundPage.patch,
    name: ROUTES.notFoundPage.name,
    component: () => import('@/pages/NotFoundPage.vue'),
  },
  {
    path: ROUTES.homePage.patch,
    name: ROUTES.homePage.name,
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: ROUTES.previewPage.patch,
    name: ROUTES.previewPage.name,
    component: () => import('@/pages/ReportPreviewPage.vue'),
  },
  /* todo - сделать заметку про различия и лейзи загрузку, найти инфу 404 нужно первой или последней
  { path: '/', component: HomePage },
  { path: '/preview', component: ReportPreviewPage },*/
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
