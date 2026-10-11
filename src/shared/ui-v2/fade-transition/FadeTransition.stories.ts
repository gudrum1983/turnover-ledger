import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { ButtonBase } from '@/shared/ui-v2/button-base'
import { FadeTransition } from './index'

const meta = {
  title: 'UI-V2-Компоненты/FadeTransition',
  component: FadeTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Плавное появление и исчезновение содержимого через прозрачность за 200 мс. При prefers-reduced-motion анимация отключается. Обёртка не резервирует место под содержимое.',
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: [undefined, 'out-in', 'in-out'] },
  },
} satisfies Meta<typeof FadeTransition>

export default meta
type Story = StoryObj<typeof meta>

export const ShowHide: Story = {
  name: 'Показать / скрыть',
  render: (args) => ({
    components: { FadeTransition, ButtonBase },
    setup: () => ({ args, visible: ref(false) }),
    template: `
      <div style="width: 320px; display: grid; gap: 16px;">
        <ButtonBase :aria-expanded="visible" aria-controls="fade-show-hide" @click="visible = !visible">
          {{ visible ? 'Скрыть' : 'Показать' }}
        </ButtonBase>
        <div id="fade-show-hide" style="min-height: 80px;" aria-live="polite">
          <FadeTransition v-bind="args">
            <div v-if="visible" class="u-typo-body-m" style="padding: 16px; border-radius: 16px; background: var(--neutral-100);">
              Плавно появляющийся блок
            </div>
          </FadeTransition>
        </div>
      </div>
    `,
  }),
}

export const OutIn: Story = {
  name: 'Смена содержимого: out-in',
  args: { mode: 'out-in' },
  render: (args) => ({
    components: { FadeTransition, ButtonBase },
    setup: () => ({ args, first: ref(true) }),
    template: `
      <div style="width: 320px; display: grid; gap: 16px;">
        <ButtonBase @click="first = !first">Сменить содержимое</ButtonBase>
        <div style="min-height: 80px;" aria-live="polite">
          <FadeTransition v-bind="args">
            <div :key="first ? 'first' : 'second'" class="u-typo-body-m" :style="{ background: first ? 'var(--neutral-100)' : 'var(--yellow-400)' }" style="padding: 16px; border-radius: 16px;">
              {{ first ? 'Первый блок' : 'Второй блок' }}
            </div>
          </FadeTransition>
        </div>
      </div>
    `,
  }),
}
