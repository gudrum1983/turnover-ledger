import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LinkEmail } from './index'

const meta = {
  title: 'UI-Компоненты/LinkEmail',
  parameters: {
    docs: {
      description: {
        component:
          'Почтовая ссылка на базе обычного тега `a` с `mailto:`. Поддерживает размеры текста и наследует базовый стиль ссылок.',
      },
    },
  },
  component: LinkEmail,
  tags: ['autodocs'],
  args: {
    email: 'hello@example.com',
    size: 'md',
    default: 'Написать письмо',
  },
  argTypes: {
    email: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    default: {
      control: 'text',
      description: 'Текст ссылки',
      table: {
        type: {
          summary: 'VNode',
        },
      },
    },
  },
  render: (args) => ({
    components: { LinkEmail },
    setup() {
      return { args }
    },
    template: '<LinkEmail :email="args.email" :size="args.size">{{ args.default }}</LinkEmail>',
  }),
} satisfies Meta<typeof LinkEmail>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная история для проверки `mailto:`-ссылки и размеров текста.',
      },
    },
  },
}

export const Default: Story = {
  name: 'По умолчанию',
}

export const AddressOnly: Story = {
  name: 'Только адрес',
  args: {
    default: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Если слот не передан, компонент показывает сам email-адрес.',
      },
    },
  },
}
