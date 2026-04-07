import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { DividerBase } from './index'

const meta = {
  title: 'UI-Компоненты/DividerBase',
  parameters: {
    docs: {
      description: {
        component:
          'Разделитель для горизонтальных и вертикальных раскладок. Поддерживает стиль линии, цветовой токен, толщину, подпись и отступы от краёв.',
      },
    },
  },
  component: DividerBase,
  tags: ['autodocs'],
  args: {
    thickness: 1,
    lineStyle: 'solid',
    color: 'default',
    isVertical: false,
    label: 'Раздел',
    labelPosition: 'center',
    labelOffset: 0,
    edgeOffset: 0,
  },
  argTypes: {
    thickness: {
      control: { type: 'number', min: 1, max: 20 },
    },
    lineStyle: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge'],
    },
    color: {
      control: 'select',
      options: [
        'base',
        'table',
        'default',
        'primary',
        'info',
        'success',
        'warning',
        'danger',
        'ring',
        'disabled',
        'table-cell',
      ],
    },
    isVertical: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    labelOffset: {
      control: { type: 'number', min: 0 },
    },
    edgeOffset: {
      control: { type: 'number', min: 0 },
    },
  },
  render: (args) => ({
    components: { DividerBase },
    setup() {
      return { args }
    },
    template: `
      <div :style="{ height: args.isVertical ? '160px' : 'auto', display: 'flex', alignItems: 'stretch' }">
        <DividerBase v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof DividerBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная история для проверки линии, подписи, цвета и ориентации разделителя.',
      },
    },
  },
}

export const WithoutLabel: Story = {
  name: 'Без подписи',
  args: {
    label: '',
  },
}

export const DashedPrimary: Story = {
  name: 'Пунктирный primary',
  args: {
    label: 'Итоги',
    lineStyle: 'dashed',
    color: 'primary',
    thickness: 2,
  },
}

export const Vertical: Story = {
  name: 'Вертикальный',
  args: {
    isVertical: true,
    label: 'Не отображается',
    color: 'primary',
    thickness: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Вертикальный разделитель не показывает подпись, потому что подпись поддержана только для горизонтальной ориентации.',
      },
    },
  },
}
