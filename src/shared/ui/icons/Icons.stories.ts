import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  IconAdd,
  IconChevron,
  IconClose,
  IconCompress,
  IconCopy,
  IconEdit,
  IconExpand,
  IconInput,
  IconTrash,
} from './index'

const icons = [
  { name: 'IconAdd', component: IconAdd },
  { name: 'IconChevron', component: IconChevron },
  { name: 'IconClose', component: IconClose },
  { name: 'IconCompress', component: IconCompress },
  { name: 'IconCopy', component: IconCopy },
  { name: 'IconEdit', component: IconEdit },
  { name: 'IconExpand', component: IconExpand },
  { name: 'IconInput', component: IconInput },
  { name: 'IconTrash', component: IconTrash },
]

const meta = {
  title: 'UI-Компоненты/Icons',
  parameters: {
    docs: {
      description: {
        component:
          'Набор SVG-иконок из `src/shared/ui/icons`. Иконки рендерятся как Vue-компоненты и обычно наследуют цвет через `currentColor`.',
      },
    },
  },
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { icons }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;">
        <div
          v-for="icon in icons"
          :key="icon.name"
          style="display: grid; gap: 8px; justify-items: center; padding: 16px; border-radius: 8px; background: var(--color-background-surface); box-shadow: var(--shadow); color: var(--color-text-default);"
        >
          <component :is="icon.component" style="width: 32px; height: 32px;" />
          <code>{{ icon.name }}</code>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  name: 'Обзор',
}
