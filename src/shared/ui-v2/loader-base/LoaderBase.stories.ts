import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LoaderBase } from './index'

const meta = {
  title: 'UI-V2-Компоненты/LoaderBase',
  parameters: {
    docs: {
      description: {
        component:
          'Кольцевой лоадер с вращением шагами по 15°. Использует SVG дизайнера: `s` — 18 px, `m` — 22 px. Цвет и толщина заданы в самих SVG.',
      },
    },
  },
  component: LoaderBase,
  tags: ['autodocs'],
  args: {
    size: 'm',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm'],
    },
  },
  render: (args) => ({
    components: { LoaderBase },
    setup() {
      return { args }
    },
    template: `
      <div style="display: inline-flex; align-items: center; justify-content: center; min-width: 64px; min-height: 64px;">
        <LoaderBase v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<typeof LoaderBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Default: Story = {
  name: 'По умолчанию',
}

export const Sizes: Story = {
  name: 'Размеры',
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Сравнение размеров лоадера для разных сценариев, включая компактные кнопки.',
      },
    },
  },
  render: () => ({
    components: { LoaderBase },
    template: `
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
          gap: 16px;
          align-items: start;
        "
      >
        <div style="display: grid; gap: 8px; justify-items: center;">
          <LoaderBase size="s" />
          <span>s</span>
        </div>
        <div style="display: grid; gap: 8px; justify-items: center;">
          <LoaderBase size="m" />
          <span>m</span>
        </div>
      </div>
    `,
  }),
}
