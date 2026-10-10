import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TooltipBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/TooltipBase',
  component: TooltipBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Внешний вид подсказки. Содержимое передаётся в слот; позиционирование и показ задаёт TooltipWrapper.',
      },
    },
  },
  args: { default: 'Текст подсказки' },
  argTypes: {
    maxWidth: { control: { type: 'number', min: 0 } },
    default: { control: 'text', description: 'Содержимое подсказки' },
  },
  render: ({ default: text, ...props }) => ({
    components: { TooltipBase },
    setup: () => ({ props, text }),
    template: '<TooltipBase v-bind="props">{{ text }}</TooltipBase>',
  }),
} satisfies Meta<typeof TooltipBase>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { name: 'Песочница' }
export const LimitedWidth: Story = {
  name: 'Перенос длинного текста',
  args: { maxWidth: 180, default: 'Подсказка с длинным текстом переносится внутри заданной максимальной ширины.' },
}
