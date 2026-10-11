import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LangToggleButton from './LangToggleButton.vue'

const meta = {
  title: 'UI-V2-Компоненты/LangToggleButton',
  component: LangToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка варианта языка внутри LangToggle. Выбранный вариант выделен и отключён для повторного выбора. Нажатие доступной кнопки вызывает событие select.',
      },
    },
  },
  args: { tag: 'ENG', label: 'English', selected: false },
  argTypes: { tag: { control: 'text' }, label: { control: 'text' }, selected: { control: 'boolean' } },
} satisfies Meta<typeof LangToggleButton>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = { name: 'Песочница' }
export const Selected: Story = { name: 'Выбранный вариант', args: { selected: true } }
