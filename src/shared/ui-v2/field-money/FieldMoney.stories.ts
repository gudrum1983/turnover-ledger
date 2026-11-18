import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldMoney } from './index'

const meta = {
  title: 'UI-V2-Компоненты/FieldMoney',
  parameters: {
    docs: {
      description: {
        component:
          'Денежное поле на базе `FieldBase`. Маска пропускает цифры и до двух знаков после разделителя дробной части; разделитель берётся из `Intl`-локали. После ухода из поля значение приводится к двум знакам: «1200» → «1200,00».',
      },
    },
  },
  component: FieldMoney,
  tags: ['autodocs'],
  args: {
    name: 'amount',
    label: 'Сумма',
    placeholder: '0,00',
    modelValue: '1200,50',
    locale: 'ru-RU',
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    modelValue: { control: 'text' },
    locale: {
      control: 'select',
      options: ['ru-RU', 'en-US', 'sr-RS'],
    },
  },
  render: (args) => ({
    components: { FieldMoney },
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
        <FieldMoney
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof FieldMoney>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Empty: Story = {
  name: 'Пустое поле',
  args: { modelValue: null },
}

export const WithDotSeparator: Story = {
  name: 'С точкой',
  args: { placeholder: '0.00', modelValue: '1200.50', locale: 'en-US' },
}

export const WithHint: Story = {
  name: 'С подсказкой',
  args: { hint: 'Сумма в валюте поступления.' },
}

export const WithError: Story = {
  name: 'С ошибкой',
  args: { modelValue: null, error: true, errorMessage: 'Введите сумму.' },
}
