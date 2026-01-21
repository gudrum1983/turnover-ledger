import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes.ts'

const routes = [
  {
    path: ROUTES.notFound.path,
    name: ROUTES.notFound.name,
    component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
  },
  {
    path: ROUTES.reportBuilder.path,
    name: ROUTES.reportBuilder.name,
    component: () => import('@/pages/report-builder/ui/ReportBuilderPage.vue'),
  },
  {
    path: ROUTES.reportPreview.path,
    name: ROUTES.reportPreview.name,
    component: () => import('@/pages/report-preview/ui/ReportPreviewPage.vue'),
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
