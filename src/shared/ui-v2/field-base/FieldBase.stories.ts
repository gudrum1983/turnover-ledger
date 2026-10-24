import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/FieldBase',
  parameters: {
    docs: {
      description: {
        component:
          'Базовое текстовое поле с очисткой и debounce. Ошибка отображается в тултипе по центру поля без сдвига формы, обычная подсказка привязана к иконке.',
      },
    },
  },
  component: FieldBase,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    disabled: false,
    readonly: false,
    error: false,
    errorMessage: 'Укажите ровно 4 цифры.',
    name: 'description',
    label: 'Описание',
    hint: 'Подсказка к полю: введите описание.',
    placeholder: 'Введите текст',
    modelValue: 'Текст',
    debounceMs: 0,
    maxLength: undefined,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    error: {
      control: 'boolean',
    },
    errorMessage: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    hint: {
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

export const WithError: Story = {
  name: 'С ошибкой',
  args: {
    error: true,
  },
}

export const ErrorWithHint: Story = {
  name: 'Ошибка с подсказкой',
  args: {
    error: true,
    errorMessage: 'Значение должно содержать ровно четыре цифры. Проверьте введённые данные и попробуйте снова.',
    hint: 'Введите код из документа без пробелов и разделителей.',
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

export const WithHint: Story = {
  name: 'С подсказкой',
  args: {
    label: 'ИНН',
    hint: 'Укажите ИНН без пробелов и разделителей.',
    modelValue: null,
    placeholder: 'Введите ИНН',
  },
}

export const ShortError: Story = {
  name: 'Короткая ошибка по центру поля',
  args: { error: true, errorMessage: 'Обязательное поле', hint: '', modelValue: null },
}

// Цветовой вариант сам по себе не включает ошибку валидации или её тултип.
export const Success: Story = {
  name: 'Вариант success',
  args: { variant: 'success' },
}

export const Warning: Story = {
  name: 'Вариант warning',
  args: { variant: 'warning' },
}

export const ErrorVariant: Story = {
  name: 'Вариант error без ошибки валидации',
  args: { variant: 'error', error: false },
}

export const Disabled: Story = {
  name: 'Отключённое поле',
  args: { disabled: true },
}

export const Readonly: Story = {
  name: 'Только чтение',
  args: { readonly: true },
}
