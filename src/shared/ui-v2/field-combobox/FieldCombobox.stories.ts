import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldCombobox } from './index'

const CURRENCIES = ['EUR', 'USD', 'RSD', 'GBP', 'CHF', 'JPY', 'CNY', 'RUB', 'CAD', 'AUD', 'SEK', 'NOK', 'PLN', 'HUF']

const meta = {
  title: 'UI-V2-Компоненты/FieldCombobox',
  component: FieldCombobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле с выпадающим списком и фильтрацией по введённым символам. Сначала показываются варианты, начинающиеся с запроса, затем содержащие его. Enter/Tab выбирает подсвеченный вариант, Esc закрывает список и возвращает выбранное значение.',
      },
    },
  },
  args: {
    name: 'currency',
    label: 'Валюта',
    placeholder: 'Начните вводить код валюты',
    modelValue: null,
    options: CURRENCIES.map((code) => ({ value: code, label: code })),
    favorites: [],
    disabled: false,
    error: false,
  },
  argTypes: {
    modelValue: { control: 'text' },
    options: { control: 'object' },
    favorites: { control: 'object' },
  },
  render: (args) => ({
    components: { FieldCombobox },
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
      '<div style="width: 280px; min-height: 340px"><FieldCombobox v-bind="args" v-model="value" /><p style="margin: 0; padding-top: 24px">Значение: {{ value ?? "null" }}</p></div>',
  }),
} satisfies Meta<typeof FieldCombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { name: 'Пустое' }

export const Filled: Story = {
  name: 'Заполненное',
  args: { modelValue: 'EUR' },
}

export const WithFavorites: Story = {
  name: 'С избранными',
  args: { favorites: ['RSD', 'EUR'] },
}

export const Collapsible: Story = {
  name: 'Свёрнуто до избранных',
  args: { favorites: ['RSD', 'EUR', 'USD'], collapsible: true },
}

export const WithHint: Story = {
  name: 'С подсказкой',
  args: { hint: 'Без даты показан общий список валют НБС.' },
}

export const WithError: Story = {
  name: 'С ошибкой',
  args: {
    modelValue: 'DEM',
    options: [...CURRENCIES, 'DEM'].map((code) => ({ value: code, label: code })),
    hint: 'Без даты показан общий список валют НБС.',
    error: true,
    errorMessage: 'У этой валюты нет курса НБС на выбранную дату.',
  },
}

export const WithDescription: Story = {
  name: 'С описаниями',
  args: {
    label: 'Страна',
    placeholder: 'Начните вводить название',
    options: [
      { value: 'RS', label: 'Сербия', description: 'RSD' },
      { value: 'ME', label: 'Черногория', description: 'EUR' },
      { value: 'DE', label: 'Германия', description: 'EUR' },
      { value: 'CH', label: 'Швейцария', description: 'CHF' },
      { value: 'GB', label: 'Великобритания', description: 'GBP' },
    ],
  },
}

export const Error: Story = {
  name: 'Ошибка',
  args: { error: true },
}

export const Disabled: Story = {
  name: 'Отключённое',
  args: { modelValue: 'EUR', disabled: true },
}
