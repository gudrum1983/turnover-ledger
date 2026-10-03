import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PointBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/PointBase',
  component: PointBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Круглый маркер размером 6 × 6 px. Может использоваться как разделитель между пунктами. По умолчанию цвет — var(--blue-600); currentColor наследует цвет текста.',
      },
    },
  },
  args: { color: 'var(--blue-600)' },
  argTypes: {
    color: { control: 'text' },
  },
} satisfies Meta<typeof PointBase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'По умолчанию' }
export const CustomColor: Story = {
  name: 'Произвольный цвет',
  args: { color: '#c4542c' },
}
export const CurrentColor: Story = {
  name: 'Цвет текста',
  args: { color: 'currentColor' },
  render: (args) => ({
    components: { PointBase },
    setup: () => ({ args }),
    template: `<div class="u-typo-body-m" style="display: flex; align-items: center; gap: 12px; color: var(--neutral-600)">
      <span>О приложении</span>
      <PointBase v-bind="args" />
      <span>Контакты</span>
    </div>`,
  }),
}
