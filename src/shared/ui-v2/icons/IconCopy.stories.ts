import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconCopy } from './index'
import { ICON_SIZES } from './sizes'

const meta = {
  title: 'UI-V2-Компоненты/Icons/IconCopy',
  component: IconCopy,
  tags: ['autodocs'],
  args: { size: 'xl' },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Иконка копирования. Цвет наследуется через currentColor.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: Object.keys(ICON_SIZES) },
  },
} satisfies Meta<typeof IconCopy>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Sizes: Story = {
  name: 'Размеры',
  parameters: { controls: { exclude: ['size'] } },
  render: () => ({
    components: { IconCopy },
    setup: () => ({ sizes: Object.entries(ICON_SIZES).map(([name, config]) => ({ name, ...config })) }),
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div v-for="size in sizes" :key="size.name" style="display: grid; justify-items: center; gap: 12px;">
          <IconCopy :size="size.name" />
          <span>{{ size.name }} · {{ size.dimension }} px</span>
        </div>
      </div>
    `,
  }),
}

export const InheritedColor: Story = {
  name: 'Наследование цвета',
  render: (args) => ({
    components: { IconCopy },
    setup: () => ({ args }),
    template: '<div style="color: var(--blue-600);"><IconCopy v-bind="args" /></div>',
  }),
}
