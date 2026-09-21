import type { Meta, StoryContext, StoryObj } from '@storybook/vue3-vite'
import { markRaw } from 'vue'
import { IconUpload } from '../icons'
import { ButtonWithIcon } from './index'

const template = `<ButtonWithIcon v-bind="props" :icon="icon">
  {{ label }}
</ButtonWithIcon>`

const meta = {
  title: 'UI-V2-Компоненты/ButtonWithIcon',
  component: ButtonWithIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code: string, { args }: StoryContext) => {
          const attributes = [
            `variant="${args.variant}"`,
            `size="${args.size}"`,
            `type="${args.type}"`,
            ...(args.disabled ? ['disabled'] : []),
            ...(args.fullWidth ? ['full-width'] : []),
            ...(args.loading ? ['loading'] : []),
          ]

          return `<ButtonWithIcon :icon="IconUpload" ${attributes.join(' ')}>
  ${args.default}
</ButtonWithIcon>`
        },
      },
      description: {
        component:
          'Кнопка с иконкой и текстом. Компонент иконки передаётся пропсом icon, её размер задаётся кнопкой. При loading иконка заменяется лоадером без изменения ширины. Для блокировки используйте disabled.',
      },
    },
  },
  args: {
    icon: markRaw(IconUpload),
    variant: 'page',
    size: 'l',
    type: 'button',
    disabled: false,
    default: 'Загрузить данные',
    fullWidth: false,
    loading: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['page', 'accent', 'success', 'danger', 'card'] },
    size: { control: 'select', options: ['l', 'm'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    default: { control: 'text' },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: { control: false },
  },
  render: ({ default: label, icon, ...props }) => ({
    components: { ButtonWithIcon },
    setup: () => ({ props, label, icon }),
    template,
  }),
} satisfies Meta<typeof ButtonWithIcon>

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
export const Loading: Story = { name: 'Загрузка', args: { loading: true, variant: 'accent' } }
export const LoadingMedium: Story = {
  name: 'Загрузка — размер M',
  args: { loading: true, size: 'm', variant: 'accent' },
}
