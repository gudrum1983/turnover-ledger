import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ICON_SIZES } from '@/shared/ui-v2/icons/sizes'
import { DisclosureChevron } from './index'

const meta = {
  title: 'UI-V2-Компоненты/DisclosureChevron',
  component: DisclosureChevron,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Индикатор раскрытия: направлен вниз в закрытом состоянии и вверх в открытом. При изменении open направление меняется с анимацией. Сам компонент не обрабатывает нажатия.',
      },
    },
  },
  args: {
    open: false,
    size: 'xl',
  },
  argTypes: {
    open: { control: 'boolean' },
    size: { control: 'select', options: Object.keys(ICON_SIZES) },
  },
} satisfies Meta<typeof DisclosureChevron>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Open: Story = { name: 'Открытый', args: { open: true } }
export const Sizes: Story = {
  name: 'Размеры',
  render: (args) => ({
    components: { DisclosureChevron },
    setup() {
      return { args, sizes: Object.keys(ICON_SIZES) }
    },
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div v-for="size in sizes" :key="size" style="display: grid; justify-items: center; gap: 8px;">
          <DisclosureChevron v-bind="args" :size="size" />
          <span>{{ size }}</span>
        </div>
      </div>
    `,
  }),
}
