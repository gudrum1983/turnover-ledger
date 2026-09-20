import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconUpload } from '../icons'
import { ButtonIcon } from './index'

const meta = {
  title: 'UI-V2-Компоненты/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка только с иконкой. Обязательный aria-label задаёт доступное название. Основной слот получает размер иконки.',
      },
    },
  },
  args: {
    variant: 'page',
    touchTarget: false,
    size: 'l',
    type: 'button',
    disabled: false,
    ariaLabel: 'Загрузить данные',
  },
  argTypes: {
    variant: { control: 'select', options: ['page', 'accent', 'success', 'danger', 'card'] },
    touchTarget: { control: 'boolean' },
    size: { control: 'select', options: ['m', 'l'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  render: (props) => ({
    components: { ButtonIcon, IconUpload },
    setup: () => ({ props }),
    template: '<ButtonIcon v-bind="props" v-slot="{ size }"><IconUpload :size="size" /></ButtonIcon>',
  }),
} satisfies Meta<typeof ButtonIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Disabled: Story = { name: 'Неактивная', args: { disabled: true } }
export const Page: Story = { args: { variant: 'page' } }
export const Accent: Story = { args: { variant: 'accent' } }
export const Success: Story = { args: { variant: 'success' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Card: Story = { args: { variant: 'card' } }

export const Medium: Story = { name: 'M — 40 px', args: { size: 'm' } }
export const Large: Story = { name: 'L — 48 px', args: { size: 'l' } }
export const TouchMedium: Story = {
  name: 'Сенсорная M — 32 px, область нажатия 40 px',
  args: { touchTarget: true, size: 'm' },
}
export const TouchLarge: Story = {
  name: 'Сенсорная L — 40 px, область нажатия 48 px',
  args: { touchTarget: true, size: 'l' },
}
