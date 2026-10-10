import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PageLayout } from './index'

const meta = {
  title: 'UI-V2-Компоненты/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Каркас страницы со слотами header, default и footer. Короткое содержимое занимает оставшуюся высоту экрана, длинная страница прокручивается целиком. Шапка и подвал скрываются при печати.',
      },
    },
  },
  args: { mainClass: 'u-container' },
  argTypes: { mainClass: { control: 'text' } },
  render: (args) => ({
    components: { PageLayout },
    setup: () => ({ args }),
    template: `<PageLayout v-bind="args">
      <template #header><header class="u-container u-typo-subtitle-l" style="padding-block: 24px">Шапка страницы</header></template>
      <p class="u-typo-body-m">Основное содержимое страницы.</p>
      <template #footer><footer class="u-container u-typo-label-s" style="padding-block: 24px">Подвал страницы</footer></template>
    </PageLayout>`,
  }),
} satisfies Meta<typeof PageLayout>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { name: 'Короткая страница' }
export const LongContent: Story = {
  name: 'Длинная страница',
  render: (args) => ({
    components: { PageLayout },
    setup: () => ({ args }),
    template: `<PageLayout v-bind="args">
      <template #header><header class="u-container u-typo-subtitle-l" style="padding-block: 24px">Шапка страницы</header></template>
      <p v-for="paragraph in 40" :key="paragraph" class="u-typo-body-m" style="margin-block: 16px">Абзац {{ paragraph }}. Длинное содержимое прокручивается вместе со всей страницей.</p>
      <template #footer><footer class="u-container u-typo-label-s" style="padding-block: 24px">Подвал страницы</footer></template>
    </PageLayout>`,
  }),
}
