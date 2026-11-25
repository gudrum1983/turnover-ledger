import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { BadgeBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/BadgeBase',
  parameters: {
    docs: {
      description: {
        component:
          'Небольшая плашка с заливкой для пояснений к числу (например, в карточках статистики). В отличие от TagBase — без капслока и обводки.',
      },
    },
  },
  component: BadgeBase,
  tags: ['autodocs'],
  args: {
    label: '+1 сегодня',
  },
  argTypes: {
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof BadgeBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Short: Story = {
  name: 'Короткая метка',
  args: { label: '20 кир' },
}
