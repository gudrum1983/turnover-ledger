import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PaperBlock } from './index'

const meta = {
  title: 'UI-V2-Компоненты/PaperBlock',
  parameters: {
    docs: {
      description: {
        component:
          'Базовая поверхность для карточек и модальных контейнеров. Компонент задаёт фон, внутренние отступы, скругление и тень.',
      },
    },
  },
  component: PaperBlock,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'meta', 'info'] },
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
    variant: 'default',
    default: 'Контент внутри PaperBlock',
  },
  render: (args) => ({
    components: { PaperBlock },
    setup() {
      return { args }
    },
    template: `
      <PaperBlock :variant="args.variant" style="max-width: 420px;">
        <p class="u-typo-body-m">{{ args.default }}</p>
      </PaperBlock>
    `,
  }),
} satisfies Meta<typeof PaperBlock>

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

export const MetaSurface: Story = { name: 'Градиент с рисунком', args: { variant: 'meta' } }
export const InfoSurface: Story = { name: 'Градиент', args: { variant: 'info' } }
