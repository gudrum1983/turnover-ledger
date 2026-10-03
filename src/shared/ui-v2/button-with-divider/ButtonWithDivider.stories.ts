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
          'Три размера: L — все подписи и разделитель; M — левая подпись, разделитель и правое значение без rightLabel; S — только иконка и левая подпись. Все текстовые пропсы обязательны.',
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
    size: { control: 'select', options: ['l', 'm', 's'] },
    disabled: { control: 'boolean' },
    leftLabel: { control: 'text', description: 'Левая подпись, видимая во всех размерах' },
    rightLabel: {
      control: 'text',
      description: 'Подпись правой пары, видимая только в размере L',
    },
    rightValue: { control: 'text', description: 'Значение правой пары, видимое в размерах L и M' },
  },
} satisfies Meta<typeof ButtonWithDivider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Large: Story = { name: 'Размер L', args: { size: 'l' } }
export const Medium: Story = { name: 'Размер M', args: { size: 'm' } }
export const Small: Story = { name: 'Размер S', args: { size: 's' } }
export const Disabled: Story = { name: 'Неактивная', args: { disabled: true } }
export const DisabledMedium: Story = {
  name: 'Неактивная — размер M',
  args: { size: 'm', disabled: true },
}
export const DisabledSmall: Story = {
  name: 'Неактивная — размер S',
  args: { size: 's', disabled: true },
}
