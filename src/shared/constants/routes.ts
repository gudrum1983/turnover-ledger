export const ROUTES = {
  reportBuilder: {
    name: 'reportBuilder',
    path: '/',
  },
  about: {
    name: 'about',
    path: '/about',
  },
  reportPreview: {
    name: 'reportPreview',
    path: '/preview',
  },
  notFound: {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
  },
} as const
