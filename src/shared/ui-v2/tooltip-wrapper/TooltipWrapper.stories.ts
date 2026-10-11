import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TooltipWrapper } from './index'
import { ButtonBase } from '../button-base'

const meta = {
  title: 'UI-V2-Компоненты/TooltipWrapper',
  component: TooltipWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Показывает подсказку при наведении и фокусе внутри обёртки. Наведите указатель на кнопку или перейдите к ней клавишей Tab. Подсказка смещается у границ экрана.',
      },
    },
  },
  args: { text: 'Дополнительная информация', maxWidth: 240 },
  argTypes: {
    text: { control: 'text' },
    maxWidth: { control: { type: 'number', min: 0 } },
    size: { control: false },
  },
  render: (args) => ({
    components: { TooltipWrapper, ButtonBase },
    setup: () => ({ args }),
    template: '<TooltipWrapper v-bind="args"><ButtonBase>Подробнее</ButtonBase></TooltipWrapper>',
  }),
} satisfies Meta<typeof TooltipWrapper>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { name: 'Наведение и фокус' }
export const LongText: Story = {
  name: 'Длинная подсказка',
  args: { text: 'Длинная подсказка переносится на несколько строк при ограниченной ширине.', maxWidth: 180 },
}
export const NearViewportEdge: Story = {
  name: 'У края экрана',
  parameters: { layout: 'padded' },
}
