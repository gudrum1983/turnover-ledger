import { ref, watch } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FieldBaseExperimental } from './index'
import { FieldBase } from '@/shared/ui-v2/field-base'

const meta = {
  title: 'UI-V2-Эксперименты/FieldBaseExperimental',
  parameters: {
    docs: {
      description: {
        component:
          'Экспериментальная копия поля: ошибка и кончик тултипа расположены по центру поля, обычная подсказка привязана к иконке. Горизонтальное положение задаётся CSS.',
      },
    },
  },
  component: FieldBaseExperimental,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    error: false,
    errorMessage: 'Укажите ровно 4 цифры.',
    name: 'description',
    label: 'Описание',
    hint: '',
    placeholder: 'Введите текст',
    modelValue: 'Текст',
    debounceMs: 0,
    maxLength: undefined,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card'],
    },
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
    components: { FieldBaseExperimental },
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
        <FieldBaseExperimental
          v-bind="args"
          :model-value="model"
          @update:modelValue="model = $event; args.modelValue = $event"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof FieldBaseExperimental>

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

export const CardWithError: Story = {
  name: 'Card с ошибкой',
  args: {
    variant: 'card',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    const tooltip = canvas.getByRole('tooltip', { hidden: true })
    const height = canvasElement.getBoundingClientRect().height
    await expect(tooltip).not.toBeVisible()
    input.focus()
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveTextContent('Введите код из документа')
    await expect(canvasElement.getBoundingClientRect().height).toBe(height)
    const control = input.parentElement!
    const controlRect = control.getBoundingClientRect()
    await expect(tooltip.getBoundingClientRect().width).toBeLessThanOrEqual(controlRect.width)
    const tooltipRect = tooltip.getBoundingClientRect()
    await expect(
      Math.abs((tooltipRect.left + tooltipRect.right) / 2 - (controlRect.left + controlRect.right) / 2),
    ).toBeLessThan(1)
    await userEvent.keyboard('{Escape}')
    await expect(tooltip).not.toBeVisible()
    const icon = canvas.getByRole('button', { name: /Значение должно/ })
    await userEvent.click(icon)
    await expect(tooltip).toBeVisible()
    await userEvent.unhover(icon)
    input.focus()
    input.blur()
    await expect(tooltip).not.toBeVisible()
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

export const Comparison: Story = {
  name: 'Сравнение с текущим полем',
  args: {
    error: true,
    errorMessage: 'Укажите ровно 4 цифры.',
    hint: 'Введите код из документа без пробелов и разделителей.',
  },
  render: (args) => ({
    components: { FieldBase, FieldBaseExperimental },
    setup() {
      const currentValue = ref(args.modelValue)
      const experimentalValue = ref(args.modelValue)
      watch(
        () => args.modelValue,
        (value) => {
          currentValue.value = value
          experimentalValue.value = value
        },
      )
      return { args, currentValue, experimentalValue }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 48px; max-width: 800px; padding: 24px 0 180px;">
        <section>
          <p>Текущее поле — кончик у иконки</p>
          <FieldBase v-bind="args" name="current" v-model="currentValue" />
        </section>
        <section>
          <p>Эксперимент — ошибка по центру поля</p>
          <FieldBaseExperimental v-bind="args" name="experimental" v-model="experimentalValue" />
        </section>
      </div>
    `,
  }),
}

export const ShortError: Story = {
  name: 'Короткая ошибка по центру поля',
  args: { error: true, errorMessage: 'Обязательное поле', hint: '', modelValue: null },
}
