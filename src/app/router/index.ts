import { createRouter, createWebHashHistory } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes.ts'

const routes = [
  {
    path: ROUTES.notFound.path,
    name: ROUTES.notFound.name,
    component: () => import('@/pages/not-found'),
  },
  {
    path: ROUTES.reportBuilder.path,
    name: ROUTES.reportBuilder.name,
    component: () => import('@/pages/report-builder'),
  },
  {
    path: ROUTES.about.path,
    name: ROUTES.about.name,
    component: () => import('@/pages/about'),
  },
  {
    path: ROUTES.reportPreview.path,
    name: ROUTES.reportPreview.name,
    component: () => import('@/pages/report-preview'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
