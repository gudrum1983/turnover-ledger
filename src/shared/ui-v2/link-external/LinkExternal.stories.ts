import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LinkExternal } from './index'

const meta = {
  title: 'UI-V2-Компоненты/LinkExternal',
  component: LinkExternal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Обёртка над LinkBase для внешних ссылок. По умолчанию открывается в новой вкладке (_blank) с rel="noopener noreferrer". Без содержимого слота показывает URL. Наследует типографику родителя. Для отдельного размера передайте утилитарный класс через class.',
      },
    },
  },
  args: {
    href: 'https://example.com',
    target: '_blank',
    default: 'Открыть сайт',
  },
  argTypes: {
    href: { control: 'text' },
    target: { control: 'select', options: ['_self', '_blank'] },
    default: { control: 'text', description: 'Текст ссылки' },
  },
  render: ({ default: text, ...props }) => ({
    components: { LinkExternal },
    setup: () => ({ props, text }),
    template: '<LinkExternal v-bind="props">{{ text }}</LinkExternal>',
  }),
} satisfies Meta<typeof LinkExternal>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const LabelSmall: Story = {
  name: 'Класс u-typo-label-s',
  render: ({ default: text, ...props }) => ({
    components: { LinkExternal },
    setup: () => ({ props, text }),
    template: '<LinkExternal v-bind="props" class="u-typo-label-s">{{ text }}</LinkExternal>',
  }),
}
export const BodyLarge: Story = {
  name: 'Наследование u-typo-body-l',
  render: ({ default: text, ...props }) => ({
    components: { LinkExternal },
    setup: () => ({ props, text }),
    template:
      '<p class="u-typo-body-l">Ссылка внутри текста: <LinkExternal v-bind="props">{{ text }}</LinkExternal>.</p>',
  }),
}
export const CurrentTab: Story = {
  name: 'В текущей вкладке',
  args: { target: '_self' },
}
export const NewTab: Story = {
  name: 'В новой вкладке',
  args: { target: '_blank' },
}
export const UrlOnly: Story = {
  name: 'Только адрес',
  render: ({ href, target }) => ({
    components: { LinkExternal },
    setup: () => ({ props: { href, target } }),
    template: '<LinkExternal v-bind="props" />',
  }),
}
