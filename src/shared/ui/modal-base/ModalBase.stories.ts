import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonBase } from '@/shared/ui/button-base'
import { ModalBase } from './index'

const meta = {
  title: 'UI-Компоненты/ModalBase',
  parameters: {
    docs: {
      description: {
        component:
          'Базовая модалка с overlay, teleport в `body`, блокировкой скролла страницы и опциональным закрытием по overlay или Escape.',
      },
    },
  },
  component: ModalBase,
  tags: ['autodocs'],
  args: {
    open: true,
    size: 'sm',
    shouldCloseOnOverlay: true,
    shouldCloseOnEsc: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    shouldCloseOnOverlay: { control: 'boolean' },
    shouldCloseOnEsc: { control: 'boolean' },
    default: {
      control: false,
      description: 'Основное содержимое модалки',
      table: { type: { summary: 'VNode' } },
    },
    actions: {
      control: false,
      description: 'Слот действий в нижней части модалки',
      table: { type: { summary: 'VNode' } },
    },
  },
  render: (args) => ({
    components: { ButtonBase, ModalBase },
    setup() {
      const model = ref(args.open)

      watch(
        () => args.open,
        (value) => {
          model.value = value
        },
      )

      return { args, model }
    },
    template: `
      <ButtonBase color="primary" @click="model = true; args.open = true">Открыть модалку</ButtonBase>
      <ModalBase
        v-bind="args"
        :open="model"
        @update:open="model = $event; args.open = $event"
      >
        <h2 class="Typo_Heading2">Заголовок модалки</h2>
        <p class="Typo_Body">
          Базовый контейнер не знает о конкретном сценарии и принимает содержимое через слоты.
        </p>
        <template #actions>
          <ButtonBase color="default" @click="model = false; args.open = false">Отмена</ButtonBase>
          <ButtonBase color="primary" @click="model = false; args.open = false">Сохранить</ButtonBase>
        </template>
      </ModalBase>
    `,
  }),
} satisfies Meta<typeof ModalBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Small: Story = {
  name: 'Маленькая',
  args: {
    size: 'xs',
  },
}

export const WithoutActions: Story = {
  name: 'Без actions',
  render: (args) => ({
    components: { ButtonBase, ModalBase },
    setup() {
      const model = ref(args.open)

      watch(
        () => args.open,
        (value) => {
          model.value = value
        },
      )

      return { args, model }
    },
    template: `
      <ButtonBase color="primary" @click="model = true; args.open = true">Открыть модалку</ButtonBase>
      <ModalBase
        v-bind="args"
        :open="model"
        @update:open="model = $event; args.open = $event"
      >
        <h2 class="Typo_Heading2">Информационное окно</h2>
        <p class="Typo_Body">Модалка может использоваться без нижней панели действий.</p>
      </ModalBase>
    `,
  }),
}
