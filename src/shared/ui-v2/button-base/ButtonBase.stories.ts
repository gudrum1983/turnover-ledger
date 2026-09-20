import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/ButtonBase',
  component: ButtonBase,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Текстовая кнопка.' } } },
  args: {
    variant: 'page',
    size: 'l',
    type: 'button',
    disabled: false,
    default: 'Загрузить данные',
    fullWidth: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['page', 'accent', 'success', 'danger', 'card'] },
    size: { control: 'select', options: ['l', 'm'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    default: { control: 'text' },
    fullWidth: { control: 'boolean' },
  },
  render: ({ default: label, ...props }) => ({
    components: { ButtonBase },
    setup: () => ({ props, label }),
    template: '<ButtonBase v-bind="props">{{ label }}</ButtonBase>',
  }),
} satisfies Meta<typeof ButtonBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Medium: Story = { name: 'Размер M', args: { size: 'm' } }
export const Large: Story = { name: 'Размер L', args: { size: 'l' } }
export const Disabled: Story = { name: 'Неактивная', args: { disabled: true } }
export const Page: Story = { args: { variant: 'page' } }
export const Accent: Story = { args: { variant: 'accent' } }
export const Success: Story = { args: { variant: 'success' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Card: Story = { args: { variant: 'card' } }
export const FullWidth: Story = { name: 'На всю ширину', args: { fullWidth: true } }
