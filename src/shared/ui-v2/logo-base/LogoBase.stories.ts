import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LogoBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/LogoBase',
  component: LogoBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'Декоративный логотип размером 40 × 40 px. Не имеет пропсов, скрыт от скринридеров.' },
    },
  },
} satisfies Meta<typeof LogoBase>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { name: 'Логотип' }
