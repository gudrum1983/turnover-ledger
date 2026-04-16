import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldBase } from './index'

const meta = {
  title: 'UI-Компоненты/FieldBase',
  parameters: {
    docs: {
      description: {
        component:
          'Базовое текстовое поле с label, placeholder, очисткой значения, debounce для `update:modelValue` и событием `blur`.',
      },
    },
  },
  component: FieldBase,
  tags: ['autodocs'],
  args: {
    name: 'description',
    label: 'Описание',
    placeholder: 'Введите текст',
    modelValue: 'Текст',
    debounceMs: 0,
    maxLength: undefined,
  },
  argTypes: {
    name: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    modelValue: {
      control: 'text',
    },
    debounceMs: {
      control: { type: 'number', min: 0 },
    },
    maxLength: {
      control: { type: 'number', min: 0 },
    },
    mask: {
      control: false,
    },
  },
  render: (args) => ({
    components: { FieldBase },
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
      <div style="max-width: 360px;">
        <FieldBase
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof FieldBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Empty: Story = {
  name: 'Пустое поле',
  args: {
    modelValue: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Поле без значения показывает placeholder и не рендерит кнопку очистки.',
      },
    },
  },
}

export const WithMaxLength: Story = {
  name: 'С ограничением длины',
  args: {
    label: 'Комментарий',
    modelValue: 'Коротко',
    maxLength: 12,
  },
}
