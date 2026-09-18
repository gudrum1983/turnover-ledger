import type { Meta, StoryObj } from '@storybook/vue3-vite'

const groups = [
  {
    name: 'Заголовки — Oswald',
    classes: ['Typo_H1L', 'Typo_H1M', 'Typo_H2L', 'Typo_H2M', 'Typo_SubtitleL', 'Typo_SubtitleM', 'Typo_Title'],
  },
  {
    name: 'Интерфейс — Inter',
    classes: [
      'Typo_BodyL',
      'Typo_BodyM',
      'Typo_ButtonL',
      'Typo_ButtonM',
      'Typo_LabelL',
      'Typo_LabelM',
      'Typo_LabelS',
      'Typo_BodySmallL',
      'Typo_BodySmallM',
      'Typo_BodySmallS',
    ],
  },
  {
    name: 'Отчёты — Open Sans',
    classes: ['Typo_ReportTitle', 'Typo_ReportTableAccent', 'Typo_ReportBodyAccent', 'Typo_ReportBody'],
  },
]

const meta = {
  title: 'UI-V2-Утилиты/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Типографика v2 из `src/app/styles/utilities/_typography.scss`. Параметры шрифтов заданы в `src/app/styles/tokens/_typography.scss`. Примеры используют настоящие CSS-классы приложения.',
      },
    },
  },
  args: {
    text: 'Оборотная ведомость · Turnover ledger · 1 234,56 ₽',
    color: '#172021',
    uppercase: false,
  },
  argTypes: {
    text: { control: 'text', description: 'Текст для сравнения всех начертаний' },
    color: { control: 'color' },
    uppercase: { control: 'boolean', description: 'Добавляет класс Text_Uppercase' },
  },
  render: (args) => ({
    setup: () => ({ args, groups }),
    template: `
      <div :style="{ color: args.color }" style="display: grid; gap: 32px;">
        <section v-for="group in groups" :key="group.name" style="display: grid; gap: 16px;">
          <h2 class="Typo_Title">{{ group.name }}</h2>
          <div v-for="className in group.classes" :key="className" style="display: grid; gap: 8px; padding: 16px; border: 1px solid var(--neutral-200); border-radius: 8px;">
            <code>{{ className }}{{ args.uppercase ? ' + Text_Uppercase' : '' }}</code>
            <p :class="[className, { Text_Uppercase: args.uppercase }]" style="overflow-wrap: anywhere;">{{ args.text }}</p>
          </div>
        </section>
      </div>
    `,
  }),
} satisfies Meta<{ text: string; color: string; uppercase: boolean }>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Типографика' }
