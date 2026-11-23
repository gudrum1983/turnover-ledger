import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CheckboxBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/CheckboxBase',
  component: CheckboxBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Чекбокс с подписью (слот по умолчанию) и приглушённым описанием. Поддерживает v-model, частичный выбор (indeterminate), ошибку и отключённое состояние. Состояния — по макету Figma «Checkboxes». Нативный input скрыт визуально, но доступен с клавиатуры и для скринридеров.',
      },
    },
  },
  args: {
    modelValue: true,
    indeterminate: false,
    disabled: false,
    error: false,
    description: '(12 записей)',
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    description: { control: 'text' },
  },
  render: (args) => ({
    components: { CheckboxBase },
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
    template: '<CheckboxBase v-bind="args" v-model="model">2025</CheckboxBase>',
  }),
} satisfies Meta<typeof CheckboxBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Unchecked: Story = { name: 'Не отмечен', args: { modelValue: false } }
export const Indeterminate: Story = { name: 'Частичный выбор', args: { modelValue: false, indeterminate: true } }
export const Disabled: Story = { name: 'Неактивный', args: { modelValue: false, disabled: true } }
export const WithError: Story = { name: 'Ошибка', args: { modelValue: true, error: true } }

export const AllStates: Story = {
  name: 'Все состояния',
  render: () => ({
    components: { CheckboxBase },
    setup() {
      const columns = [
        { name: 'Выключен', modelValue: false, indeterminate: false },
        { name: 'Включён', modelValue: true, indeterminate: false },
        { name: 'Смешанный', modelValue: false, indeterminate: true },
      ]
      const rows = [
        { name: 'Default', props: {} },
        { name: 'Disabled', props: { disabled: true } },
        { name: 'Error', props: { error: true } },
      ]
      return { columns, rows }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, max-content); gap: 8px 32px; align-items: center">
        <span />
        <span v-for="column in columns" :key="column.name" class="u-typo-body-m">{{ column.name }}</span>
        <template v-for="row in rows" :key="row.name">
          <span class="u-typo-body-m">{{ row.name }}</span>
          <CheckboxBase
            v-for="column in columns"
            :key="column.name"
            :model-value="column.modelValue"
            :indeterminate="column.indeterminate"
            v-bind="row.props"
          >2025</CheckboxBase>
        </template>
      </div>
    `,
  }),
}
