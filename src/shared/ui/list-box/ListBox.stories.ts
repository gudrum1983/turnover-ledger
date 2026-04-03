import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ListBox } from './index'

const baseOptions = [
  { value: 'eur', label: 'EUR' },
  { value: 'usd', label: 'USD' },
  { value: 'rsd', label: 'RSD' },
  { value: 'rub', label: 'RUB' },
]

const meta = {
  title: 'UI-Компоненты/ListBox',
  parameters: {
    docs: {
      description: {
        component:
          'Список опций с одиночным выбором. Компонент поддерживает `v-model`, событие `change` и приоритизацию избранных значений в начале списка.',
      },
    },
  },
  component: ListBox,
  tags: ['autodocs'],
  args: {
    options: baseOptions,
    modelValue: 'eur',
    favorites: [],
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Список доступных значений для выбора',
    },
    modelValue: {
      control: 'text',
      description: 'Текущее выбранное значение',
    },
    favorites: {
      control: 'object',
      description: 'Список значений, которые нужно показать в начале списка',
    },
  },
  render: (args) => ({
    components: { ListBox },
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
      <ListBox
        v-bind="args"
        style="width: 160px"
        :model-value="model"
        @update:modelValue="model = $event; args.modelValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof ListBox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story:
          'Интерактивная история для проверки состава списка, текущего выбора и порядка отображения избранных значений.',
      },
    },
  },
}

export const Default: Story = {
  name: 'По умолчанию',
  parameters: {
    docs: {
      description: {
        story:
          'Базовый сценарий использования списка с одиночным выбором. Подходит для компактных меню выбора валюты, режима или фильтра.',
      },
    },
  },
}

export const WithFavorites: Story = {
  name: 'С избранными значениями',
  args: {
    options: [
      { value: 'eur', label: 'EUR' },
      { value: 'usd', label: 'USD' },
      { value: 'rsd', label: 'RSD' },
      { value: 'rub', label: 'RUB' },
      { value: 'gbp', label: 'GBP' },
      { value: 'chf', label: 'CHF' },
      { value: 'jpy', label: 'JPY' },
      { value: 'cny', label: 'CNY' },
      { value: 'sek', label: 'SEK' },
      { value: 'nok', label: 'NOK' },
      { value: 'dkk', label: 'DKK' },
      { value: 'pln', label: 'PLN' },
    ],
    favorites: ['usd', 'eur'],
  },
  render: (args) => ({
    components: { ListBox },
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
          <ListBox
            style="width: 160px; max-height: 260px; overflow-y: auto;"
            v-bind="args"
            :model-value="model"
            @update:modelValue="model = $event; args.modelValue = $event"
          />
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Часть значений помечена как избранная и отображается в верхней части списка, отделённой разделителем от остальных опций. Высота компонента ограничена, чтобы показать внутренний скролл списка.',
      },
    },
  },
}

export const WithoutOptions: Story = {
  name: '❗ Без опций',
  args: {
    modelValue: '',
    options: [],
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Некорректный сценарий использования: компонент отрисован без опций. Пользователь видит пустой контейнер и не может сделать выбор.',
      },
    },
  },
}

export const WithUnknownModelValue: Story = {
  name: '❗ modelValue вне списка',
  args: {
    modelValue: 'gbp',
    options: baseOptions,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Пограничный сценарий: `modelValue` передан, но такого значения нет в `options`. Визуально выбранный элемент отсутствует до следующего действия пользователя.',
      },
    },
  },
}

export const WithDuplicateValues: Story = {
  name: '❗ С дублирующимися value',
  args: {
    modelValue: 'eur',
    options: [
      { value: 'eur', label: 'EUR' },
      { value: 'eur', label: 'Euro' },
      { value: 'usd', label: 'USD' },
    ],
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Некорректный сценарий использования: несколько элементов имеют одинаковый `value`. В таком состоянии подсветка выбора и реакция на клик становятся неоднозначными.',
      },
    },
  },
}
