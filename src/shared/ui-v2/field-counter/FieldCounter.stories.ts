import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldCounter } from './index'

const meta = {
  title: 'UI-V2-Компоненты/FieldCounter',
  parameters: {
    docs: {
      description: {
        component:
          'Текстовое поле на базе `FieldBase` с ограничением длины `maxLength` и счётчиком символов в подписи: «Описание (12/55)».',
      },
    },
  },
  component: FieldCounter,
  tags: ['autodocs'],
  args: {
    name: 'note',
    label: 'Заметка',
    placeholder: 'До 20 символов',
    modelValue: 'Текст',
    maxLength: 20,
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    modelValue: { control: 'text' },
    maxLength: { control: { type: 'number', min: 0 } },
    debounceMs: { control: { type: 'number', min: 0 } },
  },
  render: (args) => ({
    components: { FieldCounter },
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
        <FieldCounter
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof FieldCounter>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Empty: Story = {
  name: 'Пустое поле',
  args: { modelValue: null },
}

export const FilledLimit: Story = {
  name: 'Заполнено до лимита',
  args: { modelValue: '1234567890', maxLength: 10 },
}

export const WithHint: Story = {
  name: 'С подсказкой',
  args: { hint: 'Коротко опишите поступление.' },
}

export const WithError: Story = {
  name: 'С ошибкой',
  args: { modelValue: null, error: true, errorMessage: 'Заполните поле.' },
}
