import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LinkExternal } from './index'

const meta = {
  title: 'UI-Компоненты/LinkExternal',
  parameters: {
    docs: {
      description: {
        component:
          'Внешняя ссылка на базе обычного тега `a`, которая открывается в новом окне и использует безопасный `rel` по умолчанию. Поддерживает размеры текста и базовый стиль ссылок.',
      },
    },
  },
  component: LinkExternal,
  tags: ['autodocs'],
  args: {
    href: 'https://example.com',
    size: 'md',
    default: 'Открыть внешний сайт',
  },
  argTypes: {
    href: {
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
    components: { LinkExternal },
    setup() {
      return { args }
    },
    template: '<LinkExternal :href="args.href" :size="args.size">{{ args.default }}</LinkExternal>',
  }),
} satisfies Meta<typeof LinkExternal>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная история для проверки внешней ссылки и размеров текста.',
      },
    },
  },
}

export const Default: Story = {
  name: 'По умолчанию',
}

export const UrlOnly: Story = {
  name: 'Только URL',
  args: {
    default: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Если слот не передан, компонент показывает сам URL.',
      },
    },
  },
}
