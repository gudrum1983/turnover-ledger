import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import { LangToggle } from './index'

const options = [
  { value: 'ru', tag: 'РУС', label: 'Русский' },
  { value: 'en', tag: 'ENG', label: 'English' },
  { value: 'sr', tag: 'SRP', label: 'Srpski' },
]

const meta = {
  title: 'UI-V2-Компоненты/LangToggle',
  component: LangToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tab и Shift+Tab перемещают фокус без изменения значения, пропуская выбранную кнопку. Space или Enter подтверждают выбор. Клик выбирает вариант сразу.',
      },
    },
  },
  args: {
    label: 'Язык интерфейса',
    description: 'Выберите язык кнопок, полей и сообщений приложения.',
    options,
    modelValue: 'ru',
    fullWidth: false,
  },
  argTypes: {
    modelValue: { control: 'select', options: ['ru', 'en', 'sr'] },
    fullWidth: { control: 'boolean' },
  },
  render: (args) => ({
    components: { LangToggle },
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
    template: `<div>
      <LangToggle v-bind="args" v-model="selected" />
      <p>Выбрано: {{ selected ?? 'ничего' }}</p>
    </div>`,
  }),
} satisfies Meta<typeof LangToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [russian, english, serbian] = canvas.getAllByRole('button')
    await expect(russian).toBeDisabled()
    english!.focus()
    await expect(english).toHaveFocus()
    await expect(russian).toHaveAttribute('aria-pressed', 'true')
    await expect(english).toHaveAttribute('aria-pressed', 'false')
    await userEvent.keyboard(' ')
    await expect(english).toHaveAttribute('aria-pressed', 'true')
    await expect(english).toBeDisabled()
    await expect(russian).toBeEnabled()
    await expect(canvas.getByText('Выбрано: en')).toBeInTheDocument()
    russian!.focus()
    await userEvent.tab()
    await expect(serbian).toHaveFocus()
    await expect(english).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(serbian).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText('Выбрано: sr')).toBeInTheDocument()
    await expect(serbian).toBeDisabled()
    english!.focus()
    await expect(english).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(russian).toHaveFocus()
    await expect(serbian).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(russian).toHaveAttribute('aria-pressed', 'true')
  },
}
export const Empty: Story = { name: 'Без выбора', args: { modelValue: undefined } }
export const DisabledOption: Story = {
  name: 'Неактивный вариант',
  args: { options: options.map((option) => ({ ...option, disabled: option.value === 'sr' })) },
}
export const FullWidth: Story = {
  name: 'На всю ширину',
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}
