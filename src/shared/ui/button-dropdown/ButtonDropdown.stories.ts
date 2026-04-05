import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonDropdown } from './index'

const baseOptions = [
  { value: 'eur', label: 'EUR' },
  { value: 'usd', label: 'USD' },
  { value: 'rsd', label: 'RSD' },
  { value: 'rub', label: 'RUB' },
]

const meta = {
  title: 'UI-Компоненты/ButtonDropdown',
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка с выпадающим списком для выбора одного значения. Компонент поддерживает `v-model`, placeholder и приоритизацию избранных значений в списке.',
      },
    },
  },
  component: ButtonDropdown,
  tags: ['autodocs'],
  args: {
    label: 'Валюта',
    options: baseOptions,
    modelValue: 'eur',
    placeholder: 'Выбрать',
    size: 'md',
    variant: 'outlined',
    color: 'default',
    disabled: false,
    favorites: [],
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Текстовый лейбл над кнопкой',
    },
    options: {
      control: 'object',
      description: 'Список доступных вариантов',
    },
    modelValue: {
      control: 'text',
      description: 'Текущее выбранное значение',
    },
    placeholder: {
      control: 'text',
      description: 'Текст кнопки, когда значение не выбрано',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    disabled: {
      control: 'boolean',
    },
    favorites: {
      control: 'object',
      description: 'Список значений, которые нужно показать в начале списка',
    },
  },
  render: (args) => ({
    components: { ButtonDropdown },
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
      <div style="width: 220px; padding: 24px">
        <ButtonDropdown
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof ButtonDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story:
          'Интерактивная история для проверки вариантов отображения, списка опций, выбранного значения и поведения выпадающего меню.',
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
          'Базовый сценарий использования дропдауна с выбранным значением. Подходит для переключения валюты, фильтра или режима.',
      },
    },
  },
}

export const WithFavorites: Story = {
  name: 'С избранными значениями',
  args: {
    favorites: ['usd', 'eur'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Часть значений помечена как избранная и показывается в начале списка. Это удобно, когда у пользователя есть несколько часто используемых вариантов.',
      },
    },
  },
}

export const Disabled: Story = {
  name: 'Неактивный',
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Дропдаун в отключённом состоянии. Используется, когда выбор временно недоступен, например до загрузки данных или выбора зависимого поля.',
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
          'Некорректный сценарий использования: дропдаун открыт для выбора, но список опций пустой. Пользователь видит placeholder, однако сделать выбор невозможно.',
      },
    },
  },
}

export const WithInvalidOptions: Story = {
  name: '❗ С некорректными опциями',
  args: {
    modelValue: 'eur',
    options: [
      { value: '', label: 'Пустое значение' },
      { value: 'eur', label: '' },
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
          'Некорректный сценарий использования: часть опций содержит пустой `value` или пустой `label`. В таком состоянии список рендерится, но смысл выбора и отображение выбранного значения становятся неоднозначными.',
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
          'Некорректный сценарий использования: несколько опций имеют одинаковый `value`. В таком случае отображение выбранного значения и поведение списка становятся неоднозначными, даже если `label` различается.',
      },
    },
  },
}

export const WithoutModelValue: Story = {
  name: '❗ Без modelValue',
  args: {
    modelValue: '',
    options: baseOptions,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Пограничный сценарий: `modelValue` не передан. Компонент показывает placeholder и ожидает, что первое корректное значение будет выбрано пользователем.',
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
          'Некорректный сценарий использования: `modelValue` передан, но такого значения нет в `options`. Визуально компонент показывает placeholder, хотя состояние снаружи уже содержит значение.',
      },
    },
  },
}
