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
          'В размере L кнопка показывает первое значение и пару подпись–значение с разделителем. В размере M — иконку и первое значение. Все текстовые пропсы обязательны и передаются в обоих размерах.',
      },
    },
  },
  args: {
    size: 'l',
    disabled: false,
    firstLabel: 'Язык',
    firstValue: 'Рус',
    secondLabel: 'отчет',
    secondValue: 'SRP',
  },
  argTypes: {
    size: { control: 'select', options: ['l', 'm'] },
    disabled: { control: 'boolean' },
    firstLabel: { control: false, description: 'Обязательный проп, пока не используется в шаблоне' },
    firstValue: { control: 'text', description: 'Первое значение, видимое в обоих размерах' },
    secondLabel: { control: 'text', description: 'Подпись второй пары, видимой в размере L' },
    secondValue: { control: 'text', description: 'Значение второй пары, видимой в размере L' },
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
