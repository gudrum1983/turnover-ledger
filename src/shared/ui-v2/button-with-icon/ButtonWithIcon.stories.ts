import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconUpload } from '../icons'
import { ButtonWithIcon } from './index'

const meta = {
  title: 'UI-V2-Компоненты/ButtonWithIcon',
  component: ButtonWithIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка с иконкой и текстом. Слот icon получает размер иконки. При loading иконка заменяется лоадером без изменения ширины. Для блокировки используйте disabled.',
      },
    },
  },
  args: {
    variant: 'page',
    size: 'desktop',
    type: 'button',
    disabled: false,
    default: 'Загрузить данные',
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['page', 'accent', 'success', 'danger', 'card'] },
    size: { control: 'select', options: ['desktop', 'mobile'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    default: { control: 'text' },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: { control: false },
  },
  render: ({ default: label, ...props }) => ({
    components: { ButtonWithIcon, IconUpload },
    setup: () => ({ props, label }),
    template:
      '<ButtonWithIcon v-bind="props"><template #icon="{ size }"><IconUpload :size="size" /></template>{{ label }}</ButtonWithIcon>',
  }),
} satisfies Meta<typeof ButtonWithIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Mobile: Story = { name: 'Мобильная', args: { size: 'mobile' } }
export const Disabled: Story = { name: 'Неактивная', args: { disabled: true } }
export const Page: Story = { args: { variant: 'page' } }
export const Accent: Story = { args: { variant: 'accent' } }
export const Success: Story = { args: { variant: 'success' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Card: Story = { args: { variant: 'card' } }
export const FullWidth: Story = { name: 'На всю ширину', args: { fullWidth: true } }
export const Loading: Story = { name: 'Загрузка', args: { loading: true, variant: 'accent' } }
export const LoadingMobile: Story = {
  name: 'Загрузка — мобильная',
  args: { loading: true, size: 'mobile', variant: 'accent' },
}
