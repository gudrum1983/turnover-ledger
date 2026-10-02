import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { expect, fn, userEvent, within } from 'storybook/test'
import { LabelContainer } from './index'

const options = [
  { value: 'latin', label: 'Латиница' },
  { value: 'cyrillic', label: 'Кириллица' },
]

const meta = {
  title: 'UI-V2-Компоненты/LabelContainer',
  component: LabelContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Группа кнопок для выбора одного значения. Количество вариантов не ограничено. Tab перемещает фокус, Enter и Space выбирают вариант. Повторное нажатие на выбранную кнопку не меняет значение и не вызывает события.',
      },
    },
  },
  args: {
    options,
    ariaLabel: 'Письменность отчёта',
    modelValue: 'latin',
    fullWidth: false,
    onChange: fn(),
    'onUpdate:modelValue': fn(),
  },
  argTypes: {
    options: { control: 'object' },
    ariaLabel: { control: 'text' },
    modelValue: { control: 'text' },
    fullWidth: { control: 'boolean' },
  },
  render: (args) => ({
    components: { LabelContainer },
    setup() {
      const selected = ref(args.modelValue)
      watch(
        () => args.modelValue,
        (value) => {
          selected.value = value
        },
      )
      return { args, selected }
    },
    template: '<LabelContainer v-bind="args" v-model="selected" />',
  }),
} satisfies Meta<typeof LabelContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const latin = canvas.getByRole('button', { name: 'Латиница' })
    const cyrillic = canvas.getByRole('button', { name: 'Кириллица' })
    await expect(canvas.getByRole('group', { name: args.ariaLabel })).toBeInTheDocument()
    await expect(latin).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(cyrillic)
    await expect(cyrillic).toHaveAttribute('aria-pressed', 'true')
    await expect(latin).toHaveAttribute('aria-pressed', 'false')
    await expect(args.onChange).toHaveBeenCalledTimes(1)
    await expect(args.onChange).toHaveBeenCalledWith('cyrillic')
    await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
    await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith('cyrillic')
    await userEvent.click(cyrillic)
    await expect(args.onChange).toHaveBeenCalledTimes(1)
    await expect(args['onUpdate:modelValue']).toHaveBeenCalledTimes(1)
    latin.focus()
    await userEvent.keyboard('{Enter}')
    await expect(latin).toHaveAttribute('aria-pressed', 'true')
    await userEvent.tab()
    await expect(cyrillic).toHaveFocus()
    await expect(latin).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard(' ')
    await expect(cyrillic).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Empty: Story = { name: 'Без выбора', args: { modelValue: '' } }
export const SingleOption: Story = { name: 'Один вариант', args: { options: [options[0]!] } }
export const ThreeOptions: Story = {
  name: 'Три варианта',
  args: {
    options: [
      { value: 'day', label: 'День' },
      { value: 'week', label: 'Неделя' },
      { value: 'month', label: 'Месяц' },
    ],
    ariaLabel: 'Период отчёта',
    modelValue: 'week',
  },
}
export const FullWidth: Story = {
  name: 'На всю ширину',
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}
