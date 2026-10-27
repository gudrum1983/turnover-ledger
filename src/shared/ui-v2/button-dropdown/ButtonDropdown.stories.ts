import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonDropdown } from './index'
import { DisclosureChevron } from '@/shared/ui-v2/disclosure-chevron'

const baseOptions = [
  { value: 'eur', label: 'EUR' },
  { value: 'usd', label: 'USD' },
  { value: 'rsd', label: 'RSD' },
  { value: 'rub', label: 'RUB' },
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
          'Кнопка с выпадающим списком для выбора одного значения. Поддерживает v-model, слоты label и trigger. Меню закрывается после выбора, по Escape и при нажатии вне компонента. Без выбранного варианта стандартный лейбл пустой; подсказку можно задать через слот label.',
      },
    },
  },
  args: {
    options: baseOptions,
    modelValue: 'eur',
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
    template: '<div style="min-height: 300px;"><ButtonDropdown v-bind="args" v-model="model" /></div>',
  }),
} satisfies Meta<typeof ButtonDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const Disabled: Story = { name: 'Неактивный', args: { disabled: true } }

export const WithCustomLabel: Story = {
  name: 'С кастомным лейблом',
  render: (args) => ({
    components: { ButtonDropdown },
    setup() {
      return { args, model: useStoryModel(args) }
    },
    template: `
      <div style="min-height: 300px;">
        <ButtonDropdown v-bind="args" v-model="model">
          <template #label="{ activeLabel }">Валюта: {{ activeLabel || 'Выбрать' }}</template>
        </ButtonDropdown>
      </div>
    `,
  }),
}

export const WithCustomTrigger: Story = {
  name: 'С кастомным trigger',
  render: (args) => ({
    components: { ButtonDropdown, DisclosureChevron },
    setup() {
      return { args, model: useStoryModel(args) }
    },
    template: `
      <div style="min-height: 300px;">
        <ButtonDropdown v-bind="args" v-model="model">
          <template #trigger="{ activeLabel, isOpen }">
            <span style="display: inline-flex; align-items: center; gap: 8px;">
              <strong>{{ activeLabel || 'Выбрать валюту' }}</strong>
              <DisclosureChevron :open="isOpen" />
            </span>
          </template>
        </ButtonDropdown>
      </div>
    `,
  }),
}

export const LongList: Story = {
  name: 'Длинный список со скроллом',
  args: {
    modelValue: '2026',
    options: Array.from({ length: 20 }, (_, index) => {
      const year = String(2026 - index)
      return { value: year, label: `Отчёт за ${year} год` }
    }),
  },
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
