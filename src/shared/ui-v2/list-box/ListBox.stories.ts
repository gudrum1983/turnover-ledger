import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ListBox } from './index'

const CURRENCIES = ['EUR', 'USD', 'RSD', 'GBP', 'CHF', 'JPY', 'CNY', 'RUB', 'CAD', 'AUD']

const meta = {
  title: 'UI-V2-Компоненты/ListBox',
  component: ListBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Список вариантов для выпадающих компонентов (ButtonDropdown, FieldCombobox). Избранные варианты показываются вверху и отделяются разделителем; в слот footer можно положить строку после пунктов (например, «Показать все»). Обрезанный многоточием текст пункта показывается в тултипе. Высоту списка задаёт родитель; если в списке есть разделитель, к ней прибавляется --list-box-divider-space.',
      },
    },
  },
  args: {
    options: CURRENCIES.map((code) => ({ value: code, label: code })),
    modelValue: undefined,
    favorites: [],
  },
  argTypes: {
    modelValue: { control: 'text' },
    options: { control: 'object' },
    favorites: { control: 'object' },
  },
  render: (args) => ({
    components: { ListBox },
    setup() {
      const value = ref(args.modelValue)
      watch(
        () => args.modelValue,
        (next) => {
          value.value = next
        },
      )
      return { args, value }
    },
    template:
      '<div style="width: 280px"><ListBox v-bind="args" v-model="value" style="max-height: calc(226px + var(--list-box-divider-space, 0px))" /><p style="margin: 0; padding-top: 24px">Значение: {{ value ?? "undefined" }}</p></div>',
  }),
} satisfies Meta<typeof ListBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Обычный' }

export const Selected: Story = {
  name: 'С выбранным значением',
  args: { modelValue: 'EUR' },
}

export const WithFavorites: Story = {
  name: 'С избранными',
  args: { favorites: ['RSD', 'EUR', 'USD'], modelValue: 'EUR' },
}

export const WithFooter: Story = {
  name: 'С кнопкой внизу',
  args: { favorites: ['RSD', 'EUR', 'USD'] },
  render: (args) => ({
    components: { ListBox },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `
      <div style="width: 280px">
        <ListBox v-bind="args" v-model="value" :options="args.options.filter((option) => args.favorites.includes(option.value))">
          <template #footer>
            <button type="button" class="u-typo-body-m" style="min-height: 40px; padding: 0 16px; border: none; background: none; text-align: left; color: var(--neutral-600); cursor: pointer">
              Показать все
            </button>
          </template>
        </ListBox>
      </div>`,
  }),
}

export const WithDescription: Story = {
  name: 'С описаниями и длинным текстом',
  args: {
    favorites: ['RSD', 'EUR'],
    options: [
      { value: 'RSD', label: 'RSD', description: '· Сербский динар' },
      { value: 'EUR', label: 'EUR', description: '= 117,1734 RSD · Евро' },
      { value: 'USD', label: 'USD', description: '= 100,5432 RSD · Доллар США' },
      { value: 'XDR', label: 'XDR', description: '= 150,1234 RSD · СДР (специальные права заимствования)' },
      { value: 'DEM', label: 'DEM', description: '= 59,9093 RSD · Немецкая марка' },
      { value: 'CHF', label: 'CHF', description: '= 125,4321 RSD · Швейцарский франк' },
    ],
  },
}
