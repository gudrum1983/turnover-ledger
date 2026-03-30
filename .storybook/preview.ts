import type { Preview } from '@storybook/vue3-vite'
import '@/app/styles/main.css'

const preview: Preview = {
  parameters: {
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'На этой странице',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
