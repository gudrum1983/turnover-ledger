import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonGroup } from './index'

const baseOptions = [
  { value: 'latin', label: 'Latinica' },
  { value: 'cyrillic', label: 'Ћирилица' },
  { value: 'english', label: 'English' },
]

const meta = {
  title: 'UI-Компоненты/ButtonGroup',
  parameters: {
    docs: {
      description: {
        component:
          'Группа кнопок с одиночным выбором. Компонент поддерживает `v-model`, клавиатурную навигацию и состояние отдельных отключённых опций.',
      },
    },
  },
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    modelValue: 'latin',
    options: baseOptions,
    ariaLabel: 'Выбор языка отчёта',
    disabled: false,
    fullWidth: false,
    size: 'md',
  },
  argTypes: {
    modelValue: {
      control: 'text',
    },
    options: {
      control: 'object',
    },
    ariaLabel: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
  render: (args) => ({
    components: { ButtonGroup },
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
      <ButtonGroup
        v-bind="args"
        v-model="model"
        @update:modelValue="args.modelValue = $event"
      />
    `,
  }),
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story:
          'Интерактивная история для проверки размеров, набора опций, состояния выбора и поведения `ButtonGroup` в разных конфигурациях.',
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
          'Базовый сценарий использования группы кнопок с одиночным выбором. Подходит для переключения режима, языка или фильтра.',
      },
    },
  },
}

export const FullWidth: Story = {
  name: 'На всю ширину',
  args: {
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Группа растягивается на всю ширину контейнера, а кнопки равномерно делят доступное пространство. Подходит для мобильных экранов и компактных панелей управления.',
      },
    },
  },
}

export const WithDisabledOption: Story = {
  name: 'С отключённой опцией',
  args: {
    modelValue: 'cyrillic',
    options: [
      { value: 'latin', label: 'Latinica' },
      { value: 'cyrillic', label: 'Ћирилица' },
      { value: 'english', label: 'English', disabled: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Пример группы, где часть опций недоступна для выбора. Компонент корректно исключает такие кнопки из клавиатурной навигации.',
      },
    },
  },
}

export const Disabled: Story = {
  name: 'Неактивная',
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Полностью отключённая группа кнопок. Используется, когда переключение временно недоступно, например до загрузки данных или выбора зависимого параметра.',
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
          'Некорректный сценарий использования: компонент отрисован без опций. В таком состоянии группа не даёт пользователю ни одного доступного выбора.',
      },
    },
  },
}

export const WithInvalidOptions: Story = {
  name: '❗ С некорректными опциями',
  args: {
    modelValue: 'active',
    options: [
      { value: '', label: 'Пустое значение' },
      { value: 'active', label: '' },
      { value: 'disabled-empty', label: 'Недоступная опция', disabled: true },
    ],
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Некорректный сценарий использования: часть опций содержит пустой `value` или пустой `label`. Такие данные делают поведение выбора и отображение группы неоднозначными.',
      },
    },
  },
}

export const WithDuplicateValues: Story = {
  name: '❗ С дублирующимися value',
  args: {
    modelValue: 'report',
    options: [
      { value: 'report', label: 'Отчёт' },
      { value: 'report', label: 'Сводка' },
      { value: 'archive', label: 'Архив' },
    ],
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Некорректный сценарий использования: несколько опций имеют одинаковый `value`. В таком состоянии выбор, `key` в списке и клавиатурная навигация становятся неоднозначными, даже если `label` у кнопок различается.',
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
          'Пограничный сценарий: значение `modelValue` не передано или не соответствует ни одной опции. Компонент остаётся управляемым с клавиатуры, но явный выбранный элемент отсутствует до первого действия пользователя.',
      },
    },
  },
}

export const WithUnknownModelValue: Story = {
  name: '❗ modelValue вне списка',
  args: {
    modelValue: 'missing',
    options: baseOptions,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Некорректный сценарий использования: `modelValue` передан, но такого значения нет в списке опций. Визуально ни одна кнопка не выбрана, пока пользователь не сделает новый выбор.',
      },
    },
  },
}
