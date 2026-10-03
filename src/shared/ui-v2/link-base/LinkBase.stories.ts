import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LinkBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/LinkBase',
  component: LinkBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Внутренняя ссылка на RouterLink. Наследует типографику родителя. Для отдельного размера передайте утилитарный класс через class.',
      },
    },
  },
  args: {
    to: '/storybook',
    default: 'Открыть раздел',
  },
  argTypes: {
    to: { control: 'text' },
    default: { control: 'text', description: 'Текст ссылки' },
  },
  render: ({ default: text, ...props }) => ({
    components: { LinkBase },
    setup: () => ({ props, text }),
    template: '<LinkBase v-bind="props">{{ text }}</LinkBase>',
  }),
} satisfies Meta<typeof LinkBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const LabelSmall: Story = {
  name: 'Класс u-typo-label-s',
  render: ({ default: text, ...props }) => ({
    components: { LinkBase },
    setup: () => ({ props, text }),
    template: '<LinkBase v-bind="props" class="u-typo-label-s">{{ text }}</LinkBase>',
  }),
}
export const BodyLarge: Story = {
  name: 'Наследование u-typo-body-l',
  render: ({ default: text, ...props }) => ({
    components: { LinkBase },
    setup: () => ({ props, text }),
    template: '<p class="u-typo-body-l">Ссылка внутри текста: <LinkBase v-bind="props">{{ text }}</LinkBase>.</p>',
  }),
}
