import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldDate } from './index'

const meta = {
  title: 'UI-Компоненты/FieldDate',
  parameters: {
    docs: {
      description: {
        component:
          'Поле выбора даты на базе `@vuepic/vue-datepicker`. Компонент отдаёт `modelValue` в формате `yyyy-MM-dd`, принимает date-fns локаль через prop и ограничивает выбор датами от 01.01.2020 до текущего дня.',
      },
    },
  },
  component: FieldDate,
  tags: ['autodocs'],
  args: {
    name: 'reportDate',
    label: 'Дата отчёта',
    hint: '',
    modelValue: '2025-01-15',
    required: false,
  },
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    modelValue: {
      control: 'text',
    },
    required: { control: 'boolean' },
    dateFnsLocale: {
      control: false,
    },
  },
  render: (args) => ({
    components: { FieldDate },
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
      <div style="max-width: 260px;">
        <FieldDate
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof FieldDate>

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

export const WithHint: Story = {
  name: 'С подсказкой',
  args: {
    hint: 'Укажите дату получения дохода.',
    modelValue: null,
  },
}
