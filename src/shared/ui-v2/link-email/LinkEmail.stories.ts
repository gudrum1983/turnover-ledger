import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LinkEmail } from './index'

const meta = {
  title: 'UI-V2-Компоненты/LinkEmail',
  component: LinkEmail,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Почтовая ссылка с mailto:. Наследует типографику родителя. Для отдельного размера передайте утилитарный класс через class.',
      },
    },
  },
  args: {
    email: 'hello@example.com',
    default: 'Написать письмо',
  },
  argTypes: {
    email: { control: 'text' },
    default: { control: 'text', description: 'Текст ссылки' },
  },
  render: ({ default: text, ...props }) => ({
    components: { LinkEmail },
    setup: () => ({ props, text }),
    template: '<LinkEmail v-bind="props">{{ text }}</LinkEmail>',
  }),
} satisfies Meta<typeof LinkEmail>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const LabelSmall: Story = {
  name: 'Класс u-typo-label-s',
  render: ({ default: text, ...props }) => ({
    components: { LinkEmail },
    setup: () => ({ props, text }),
    template: '<LinkEmail v-bind="props" class="u-typo-label-s">{{ text }}</LinkEmail>',
  }),
}
export const BodyLarge: Story = {
  name: 'Наследование u-typo-body-l',
  render: ({ default: text, ...props }) => ({
    components: { LinkEmail },
    setup: () => ({ props, text }),
    template: '<p class="u-typo-body-l">Ссылка внутри текста: <LinkEmail v-bind="props">{{ text }}</LinkEmail>.</p>',
  }),
}
export const AddressOnly: Story = {
  name: 'Только адрес',
  render: ({ email }) => ({
    components: { LinkEmail },
    setup: () => ({ email }),
    template: '<LinkEmail :email="email" />',
  }),
}
