export const ROUTES = {
  reportBuilder: {
    name: 'reportBuilder',
    path: '/',
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
