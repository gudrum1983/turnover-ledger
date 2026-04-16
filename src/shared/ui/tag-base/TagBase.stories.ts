import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TagBase } from './index'

const meta = {
  title: 'UI-Компоненты/TagBase',
  parameters: {
    docs: {
      description: {
        component: 'Компактный бейдж для коротких служебных меток.',
      },
    },
  },
  component: TagBase,
  tags: ['autodocs'],
  args: {
    label: 'Черновик',
  },
  argTypes: {
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof TagBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Default: Story = {
  name: 'По умолчанию',
}

export const LongLabel: Story = {
  name: 'Длинная метка',
  args: {
    label: 'Требует проверки',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Пример с более длинным текстом. Метку лучше оставлять короткой, чтобы она не конкурировала с основным контентом.',
      },
    },
  },
}
