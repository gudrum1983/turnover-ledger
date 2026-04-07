import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { DividerToggle } from './index'

const meta = {
  title: 'UI-Компоненты/DividerToggle',
  parameters: {
    docs: {
      description: {
        component:
          'Разделитель с кнопкой раскрытия. Компонент объединяет `ButtonBase` и `DividerBase`, поддерживает `v-model`, подпись, состояние disabled и настройки линии.',
      },
    },
  },
  component: DividerToggle,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    label: 'Дополнительные параметры',
    disabled: false,
    lineStyle: 'solid',
    color: 'default',
    thickness: 1,
    labelPosition: 'left',
    labelOffset: 0,
    edgeOffset: 0,
    ariaExpandLabel: 'Развернуть раздел',
    ariaCollapseLabel: 'Свернуть раздел',
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
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
    thickness: {
      control: { type: 'number', min: 1, max: 20 },
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
    ariaExpandLabel: { control: 'text' },
    ariaCollapseLabel: { control: 'text' },
  },
  render: (args) => ({
    components: { DividerToggle },
    setup() {
      const model = ref(args.modelValue)

      watch(
        () => args.modelValue,
        (value) => {
          model.value = value
        },
      )

      return { args, model }
    },
    template: `
      <DividerToggle
        v-bind="args"
        :model-value="model"
        @update:modelValue="model = $event; args.modelValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof DividerToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Opened: Story = {
  name: 'Открытый',
  args: {
    modelValue: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Открытое состояние поворачивает стандартную иконку раскрытия и обновляет `aria-expanded`.',
      },
    },
  },
}

export const Disabled: Story = {
  name: 'Неактивный',
  args: {
    disabled: true,
  },
}

export const DashedPrimary: Story = {
  name: 'Пунктирный primary',
  args: {
    lineStyle: 'dashed',
    color: 'primary',
    thickness: 2,
  },
}
