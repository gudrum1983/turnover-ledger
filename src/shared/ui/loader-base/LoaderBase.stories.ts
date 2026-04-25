import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { LoaderBase } from './index'

const meta = {
  title: 'UI-Компоненты/LoaderBase',
  parameters: {
    docs: {
      description: {
        component:
          'Базовый точечный лоадер. Размер управляется пропсом `size`, а цвет наследуется через `currentColor` от родительского контейнера.',
      },
    },
  },
  component: LoaderBase,
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
  render: (args) => ({
    components: { LoaderBase },
    setup() {
      return { args }
    },
    template: `
      <div style="display: inline-flex; align-items: center; justify-content: center; min-width: 64px; min-height: 64px; color: var(--color-text-primary);">
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
          color: var(--color-text-primary);
        "
      >
        <div style="display: grid; gap: 8px; justify-items: center;">
          <LoaderBase size="xs" />
          <span>xs</span>
        </div>
        <div style="display: grid; gap: 8px; justify-items: center;">
          <LoaderBase size="sm" />
          <span>sm</span>
        </div>
        <div style="display: grid; gap: 8px; justify-items: center;">
          <LoaderBase size="md" />
          <span>md</span>
        </div>
        <div style="display: grid; gap: 8px; justify-items: center;">
          <LoaderBase size="lg" />
          <span>lg</span>
        </div>
      </div>
    `,
  }),
}
