import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldDate } from './index'

const meta = {
  title: 'UI-V2-Компоненты/FieldDate',
  component: FieldDate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле даты v2 на основе @vuepic/vue-datepicker: дату можно ввести вручную в формате ДД.ММ.ГГГГ или выбрать в календаре. Значение — строка YYYY-MM-DD. Во всех примерах ввод ограничен годом (проп year).',
      },
    },
  },
  args: {
    name: 'date',
    label: 'Дата',
    placeholder: 'ДД.ММ.ГГГГ',
    modelValue: null,
    year: new Date().getFullYear(),
    required: false,
    disabled: false,
    separator: true,
  },
  argTypes: {
    modelValue: { control: 'text' },
    dateFnsLocale: { control: false },
    year: { control: { type: 'number' } },
    minDate: { control: false },
    maxDate: { control: false },
  },
  render: (args) => ({
    components: { FieldDate },
    setup() {
      const value = ref(args.modelValue)
      watch(
        () => args.modelValue,
        (next) => {
          value.value = next
        },
      )
      return { args, value }
    },
    template:
      '<div style="width: 280px; min-height: 420px"><FieldDate v-bind="args" v-model="value" /><p style="margin: 0; padding-top: 24px">Значение: {{ value ?? "null" }}</p></div>',
  }),
} satisfies Meta<typeof FieldDate>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { name: 'Пустое (текущий год)' }

export const Filled: Story = {
  name: 'Заполненное (2024 год)',
  args: { year: 2024, modelValue: '2024-03-01' },
}

export const Disabled: Story = {
  name: 'Отключённое (2024 год)',
  args: { year: 2024, modelValue: '2024-03-01', disabled: true },
}

export const WithoutSeparator: Story = {
  name: 'Без разделителя',
  args: { separator: false },
}
