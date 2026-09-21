import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonWithDivider } from './index'

const meta = {
  title: 'UI-V2-Компоненты/ButtonWithDivider',
  component: ButtonWithDivider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'В размере L кнопка показывает левую подпись и правую пару подпись–значение с разделителем. В размере M — иконку и левую подпись. Все текстовые пропсы обязательны и передаются в обоих размерах.',
      },
    },
  },
  args: {
    size: 'l',
    disabled: false,
    leftLabel: 'Рус',
    rightLabel: 'отчет',
    rightValue: 'SRP',
  },
  argTypes: {
    size: { control: 'select', options: ['l', 'm'] },
    disabled: { control: 'boolean' },
    leftLabel: { control: 'text', description: 'Левая подпись, видимая в обоих размерах' },
    rightLabel: { control: 'text', description: 'Подпись правой пары, видимой в размере L' },
    rightValue: { control: 'text', description: 'Значение правой пары, видимой в размере L' },
  },
} satisfies Meta<typeof ButtonWithDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Large: Story = { name: 'Размер L', args: { size: 'l' } }
export const Medium: Story = { name: 'Размер M', args: { size: 'm' } }
export const Disabled: Story = { name: 'Неактивная', args: { disabled: true } }
export const DisabledMedium: Story = {
  name: 'Неактивная — размер M',
  args: { size: 'm', disabled: true },
}
