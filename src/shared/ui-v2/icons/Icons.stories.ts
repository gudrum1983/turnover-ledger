import type { Meta, StoryObj } from '@storybook/vue3-vite'
import * as iconComponents from './index'
import { ICON_SIZES, type IconSize } from './sizes'

const icons = Object.entries(iconComponents).map(([name, component]) => ({ name, component }))
const sizes = Object.entries(ICON_SIZES).map(([name, config]) => ({ name, ...config }))

const meta = {
  title: 'UI-V2-Компоненты/Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Иконки из `src/shared/ui-v2/icons`. Цвет наследуется от родительского контейнера через currentColor. Размеры: s — 16 px, m — 18 px, l — 22 px, xl — 24 px.',
      },
    },
  },
  args: { size: 'xl', color: '#172021' },
  argTypes: {
    size: { control: 'select', options: Object.keys(ICON_SIZES) },
    color: { control: 'color' },
  },
  render: (args) => ({
    setup: () => ({ args, icons }),
    template: `
      <div :style="{ color: args.color }" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px;">
        <div v-for="icon in icons" :key="icon.name" style="display: grid; justify-items: center; gap: 12px; padding: 16px; border: 1px solid var(--neutral-200); border-radius: 8px;">
          <component :is="icon.component" :size="args.size" />
          <code>{{ icon.name }}</code>
        </div>
      </div>
    `,
  }),
} satisfies Meta<{ size: IconSize; color: string }>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Обзор' }

export const Sizes: Story = {
  name: 'Размеры',
  parameters: { controls: { exclude: ['size'] } },
  render: (args) => ({
    setup: () => ({ args, icons, sizes }),
    template: `
      <div style="overflow-x: auto;" :style="{ color: args.color }">
        <table style="border-collapse: collapse; text-align: center;">
          <thead>
            <tr>
              <th scope="col" style="padding: 12px; text-align: left;">Иконка</th>
              <th v-for="size in sizes" :key="size.name" scope="col" style="padding: 12px; min-width: 120px;">
                <div>{{ size.name }} · {{ size.dimension }} px</div>
                <small>Обводка {{ size.strokeWidth }} px</small>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="icon in icons" :key="icon.name" style="border-top: 1px solid var(--neutral-200);">
              <th scope="row" style="padding: 12px; text-align: left;"><code>{{ icon.name }}</code></th>
              <td v-for="size in sizes" :key="size.name" style="padding: 12px;">
                <component :is="icon.component" :size="size.name" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  }),
}
