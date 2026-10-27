import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ButtonDropdown } from './index'

const baseOptions = [
  { value: '2026', label: '2026', description: '(12 записей)' },
  { value: '2025', label: '2025', description: '(8 записей)' },
  { value: '2024', label: '2024', description: '(записей нет)' },
  { value: '2023', label: '2023', description: '(24 записи)' },
  { value: '2022', label: '2022', description: '(3 записи)' },
  { value: '2021', label: '2021', description: '(записей нет)' },
  { value: '2020', label: '2020', description: '(15 записей)' },
  { value: '2019', label: '2019', description: '(1 запись)' },
  { value: '2018', label: '2018', description: '(6 записей)' },
  { value: '2017', label: '2017', description: '(записей нет)' },
]

function useStoryModel(args: { modelValue?: string }) {
  const model = ref(args.modelValue)
  watch(
    () => args.modelValue,
    (value) => {
      model.value = value
    },
  )
  return model
}

const meta = {
  title: 'UI-V2-Компоненты/ButtonDropdown',
  component: ButtonDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Кнопка с выпадающим списком для выбора одного значения. Поддерживает v-model, слоты label и trigger. Ширина меню равна ширине кнопки, но не меньше 220 px. Меню выравнивается по правому краю кнопки. Меню закрывается после выбора, по Escape и при нажатии вне компонента. Без выбранного варианта стандартный лейбл пустой; подсказку можно задать через слот label.',
      },
    },
  },
  args: {
    options: baseOptions,
    modelValue: '2026',
    disabled: false,
    rootClass: '',
  },
  argTypes: {
    options: { control: 'object' },
    modelValue: { control: 'text' },
    disabled: { control: 'boolean' },
    rootClass: { control: 'text' },
  },
  render: (args) => ({
    components: { ButtonDropdown },
    setup() {
      return { args, model: useStoryModel(args) }
    },
    template:
      '<div style="min-height: 300px; display: flex; align-items: flex-start; justify-content: center;"><ButtonDropdown v-bind="args" v-model="model" /></div>',
  }),
} satisfies Meta<typeof ButtonDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const WithoutScroll: Story = {
  name: 'Без скролла',
  args: {
    options: baseOptions.slice(0, 3),
  },
}
export const KeyboardNavigation: Story = {
  name: 'Управление с клавиатуры',
  render: (args) => ({
    components: { ButtonDropdown },
    setup() {
      return { args, model: useStoryModel(args) }
    },
    template: `
      <div style="min-height: 300px; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px;">
        <button>До селекта</button>
        <ButtonDropdown v-bind="args" v-model="model" />
        <button>После селекта</button>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    canvas.getByRole('button', { name: 'До селекта' }).focus()
    await userEvent.tab()
    await expect(select).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(select).toHaveFocus()
    await expect(select).toHaveAttribute('aria-expanded', 'true')
    await expect(select).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: '2025 (8 записей)' }).id,
    )
    await userEvent.keyboard('{Escape}')
    await expect(select).toHaveTextContent('2026')
    await expect(select).toHaveAttribute('aria-expanded', 'false')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    await expect(select).toHaveTextContent('2025')
    await expect(select).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'После селекта' })).toHaveFocus()
    await expect(select).toHaveAttribute('aria-expanded', 'false')
    await userEvent.tab({ shift: true })
    await expect(select).toHaveFocus()
  },
}
export const Disabled: Story = { name: 'Неактивный', args: { disabled: true } }

export const WithCustomLabel: Story = {
  name: 'С кастомным лейблом',
  render: (args) => ({
    components: { ButtonDropdown },
    setup() {
      return { args, model: useStoryModel(args) }
    },
    template: `
      <div style="min-height: 300px; display: flex; align-items: flex-start; justify-content: center;">
        <ButtonDropdown v-bind="args" v-model="model">
          <template #label="{ activeLabel }">{{ activeLabel ? 'Отчёт за ' + activeLabel + ' год' : 'Выбрать год' }}</template>
        </ButtonDropdown>
      </div>
    `,
  }),
}

export const WithoutModelValue: Story = {
  name: 'Без выбранного значения',
  args: { modelValue: undefined },
  render: WithCustomLabel.render,
}

export const WithoutOptions: Story = {
  name: 'Пустой список',
  args: { modelValue: undefined, options: [] },
  render: WithCustomLabel.render,
}

export const WithoutDescriptions: Story = {
  name: 'Только лейблы, без описаний',
  parameters: {
    docs: {
      description: {
        story: 'Тот же список годов без поля description: в опциях отображается только год, без количества записей.',
      },
    },
  },
  args: {
    options: baseOptions.map(({ value, label }) => ({ value, label })),
  },
}
