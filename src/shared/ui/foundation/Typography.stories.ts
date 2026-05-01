import type { Meta, StoryObj } from '@storybook/vue3-vite'

const typographySamples = [
  { className: 'Typo_Display', label: 'Typo_Display', text: 'Оборотная ведомость' },
  { className: 'Typo_Heading1', label: 'Typo_Heading1', text: 'Сводный отчёт по операциям' },
  { className: 'Typo_Heading2', label: 'Typo_Heading2', text: 'Параметры отчёта' },
  { className: 'Typo_Title1', label: 'Typo_Title1', text: 'Раздел с ключевыми метриками' },
  { className: 'Typo_Title2', label: 'Typo_Title2', text: 'Дополнительные настройки' },
  { className: 'Typo_Body', label: 'Typo_Body', text: 'Базовый текст для интерфейсов, описаний и сообщений.' },
  {
    className: 'Typo_BodyAccent',
    label: 'Typo_BodyAccent',
    text: 'Акцентный текст для важных пояснений и вспомогательных блоков.',
  },
  { className: 'Typo_Helper', label: 'Typo_Helper', text: 'Подсказка для пользователя перед вводом данных.' },
  { className: 'Typo_Caption', label: 'Typo_Caption', text: 'Подпись поля формы или таблицы.' },
  { className: 'Typo_ReportBody', label: 'Typo_ReportBody', text: 'Строка печатного отчёта с обычным значением.' },
  {
    className: 'Typo_ReportBodyAccent',
    label: 'Typo_ReportBodyAccent',
    text: 'Строка печатного отчёта с выделенным значением.',
  },
  { className: 'Typo_ReportTitle', label: 'Typo_ReportTitle', text: 'Итоговая строка отчёта' },
  {
    className: 'Typo_ReportTableAccent',
    label: 'Typo_ReportTableAccent',
    text: 'Акцент в шапке или итогах табличного отчёта.',
  },
]

const meta = {
  title: 'UI-Утилиты/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Глобальные типографические классы из `src/app/styles/typography.css`. История показывает их на реальных текстовых примерах.',
      },
    },
  },
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { typographySamples }
    },
    template: `
      <div style="display: grid; gap: 20px;">
        <div
          v-for="sample in typographySamples"
          :key="sample.className"
          style="display: grid; gap: 6px; padding: 16px; border-radius: 8px; background: var(--color-background-surface); box-shadow: var(--shadow);"
        >
          <code style="color: var(--color-text-caption);">{{ sample.label }}</code>
          <p :class="sample.className">{{ sample.text }}</p>
        </div>
        <div style="display: grid; gap: 6px; padding: 16px; border-radius: 8px; background: var(--color-background-surface); box-shadow: var(--shadow);">
          <code style="color: var(--color-text-caption);">Typo_Uppercase + Typo_Helper</code>
          <p class="Typo_Helper Typo_Uppercase">служебный статус документа</p>
        </div>
      </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  name: 'Обзор',
  parameters: {
    docs: {
      source: {
        code: `
<section>
  <h1 class="Typo_Display">Оборотная ведомость</h1>
  <h2 class="Typo_Heading1">Сводный отчёт по операциям</h2>
  <p class="Typo_Body">
    Базовый текст для интерфейсов, описаний и сообщений.
  </p>
  <p class="Typo_Helper Typo_Uppercase">
    служебный статус документа
  </p>
</section>
        `.trim(),
      },
    },
  },
}
