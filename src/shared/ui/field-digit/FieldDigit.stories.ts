import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldDigit } from './index'

const meta = {
  title: 'UI-Компоненты/FieldDigit',
  parameters: {
    docs: {
      description: {
        component: 'Поле на базе `FieldBase` с маской, которая пропускает только цифры.',
      },
    },
  },
  component: FieldDigit,
  tags: ['autodocs'],
  args: {
    name: 'quantity',
    label: 'Количество',
    placeholder: '0',
    modelValue: '12',
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    modelValue: { control: 'text' },
  },
  render: (args) => ({
    components: { FieldDigit },
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
      <div style="max-width: 240px;">
        <FieldDigit
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof FieldDigit>

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
}
