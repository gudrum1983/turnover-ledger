import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LinkBase } from './index'

const meta = {
  title: 'UI-Компоненты/LinkBase',
  parameters: {
    docs: {
      description: {
        component:
          'Базовая внутренняя ссылка на `RouterLink`. Компонент принимает маршрут через `to`, поддерживает размеры текста и наследует состояние hover из дизайн-токенов.',
      },
    },
  },
  component: LinkBase,
  tags: ['autodocs'],
  args: {
    to: '/storybook',
    size: 'md',
    default: 'Открыть раздел',
  },
  argTypes: {
    to: {
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
    components: { LinkBase },
    setup() {
      return { args }
    },
    template: '<LinkBase v-bind="args">{{ args.default }}</LinkBase>',
  }),
} satisfies Meta<typeof LinkBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная история для проверки размера и текста внутренней ссылки.',
      },
    },
  },
}

export const Default: Story = {
  name: 'По умолчанию',
}

export const Large: Story = {
  name: 'Крупная',
  args: {
    size: 'lg',
    default: 'Крупная ссылка',
  },
  parameters: {
    docs: {
      description: {
        story: 'Ссылка с увеличенным размером текста для заметных навигационных действий.',
      },
    },
  },
}

export const WithoutText: Story = {
  name: '❗ Без текста',
  args: {
    default: '',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Некорректный сценарий использования: ссылка без текстового содержимого не даёт понятной точки навигации.',
      },
    },
  },
}
