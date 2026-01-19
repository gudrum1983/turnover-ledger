export const ROUTES = {
  notFoundPage: { name: 'NotFound', patch: '/:pathMatch(.*)*' },
  previewPage: { name: 'Preview', patch: '/preview' },
  homePage: { name: 'Home', patch: '/' },
}
