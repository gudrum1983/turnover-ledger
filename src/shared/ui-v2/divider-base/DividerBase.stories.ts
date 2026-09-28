import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { DividerBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/DividerBase',
  component: DividerBase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Горизонтальная линия: 3 px в центре, плавно сужается до 1 px по краям. Ширина — 100% контейнера. Цвет задаётся CSS-переменной --divider-color.',
      },
    },
  },
} satisfies Meta<typeof DividerBase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'По умолчанию' }
export const Widths: Story = {
  name: 'Разная ширина',
  render: () => ({
    components: { DividerBase },
    template: `<div style="display: flex; flex-direction: column; gap: 32px">
      <DividerBase style="width: 120px" />
      <DividerBase style="width: 320px; max-width: 100%" />
      <DividerBase />
    </div>`,
  }),
}
