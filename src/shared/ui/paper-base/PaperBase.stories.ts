import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PaperBase } from './index'

const meta = {
  title: 'UI-Компоненты/PaperBase',
  parameters: {
    docs: {
      description: {
        component:
          'Базовая поверхность для карточек и модальных контейнеров. Компонент задаёт фон, внутренние отступы, скругление и тень.',
      },
    },
  },
  component: PaperBase,
  tags: ['autodocs'],
  argTypes: {
    default: {
      control: 'text',
      description: 'Содержимое поверхности',
      table: {
        type: {
          summary: 'VNode',
        },
      },
    },
  },
  args: {
    default: 'Контент внутри PaperBase',
  },
  render: (args) => ({
    components: { PaperBase },
    setup() {
      return { args }
    },
    template: `
      <PaperBase style="max-width: 420px;">
        <p class="Typo_Body">{{ args.default }}</p>
      </PaperBase>
    `,
  }),
} satisfies Meta<typeof PaperBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const WithContent: Story = {
  name: 'С контентом',
  args: {
    default: 'Поверхность отделяет смысловой блок от фона страницы.',
  },
}
