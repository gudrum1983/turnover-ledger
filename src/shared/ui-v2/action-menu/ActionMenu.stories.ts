import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconCopy, IconPen, IconTrash } from '../icons'
import { ActionMenu } from './index'

const meta = {
  title: 'UI-V2-Компоненты/ActionMenu',
  component: ActionMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка-иконка «⋯» с меню действий. Меню выводится в body, поэтому его не обрезают overflow родителей. ' +
          'Управление с клавиатуры: стрелки, Home/End, Enter/Space, Escape, Tab.',
      },
    },
  },
  args: {
    ariaLabel: 'Действия с записью',
    triggerVariant: 'card',
    items: [
      { value: 'edit', label: 'Изменить', icon: IconPen },
      { value: 'copy', label: 'Копировать', icon: IconCopy },
      { value: 'remove', label: 'Удалить', icon: IconTrash, danger: true },
    ],
  },
  argTypes: {
    ariaLabel: { control: 'text' },
    triggerVariant: { control: 'select', options: ['page', 'card'] },
    items: { control: false },
  },
  render: (args) => ({
    components: { ActionMenu },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; justify-content: center; padding: 24px;">
        <ActionMenu v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const NearLeftEdge: Story = {
  name: 'У левого края окна',
  render: (args) => ({
    components: { ActionMenu },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; justify-content: flex-start; padding: 24px;">
        <ActionMenu v-bind="args" />
      </div>
    `,
  }),
}
