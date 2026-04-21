import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { DisplayField } from './index'

const meta = {
  title: 'UI-Компоненты/DisplayField',
  parameters: {
    docs: {
      description: {
        component:
          'Статичное поле для отображения значения с подписью. Подходит как read-only дополнение к инпутам в формах и карточках.',
      },
    },
  },
  component: DisplayField,
  tags: ['autodocs'],
  args: {
    label: 'Валюта',
    value: 'Российский рубль',
  },
  argTypes: {
    label: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
  },
  render: (args) => ({
    components: { DisplayField },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 320px;">
        <DisplayField v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof DisplayField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Default: Story = {
  name: 'По умолчанию',
}

export const EmptyValue: Story = {
  name: 'Пустое значение',
  args: {
    label: 'Комментарий',
    value: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Если значение не передано, компонент показывает дефолтный символ `-`.',
      },
    },
  },
}
