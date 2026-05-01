import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonBase } from '@/shared/ui/button-base'
import { DialogConfirm } from './index'

const meta = {
  title: 'UI-Компоненты/DialogConfirm',
  parameters: {
    docs: {
      description: {
        component:
          'Готовый диалог подтверждения на базе `ModalBase`. Поддерживает сценарии подтверждения и удаления, кастомный контент и тексты кнопок.',
      },
    },
  },
  component: DialogConfirm,
  tags: ['autodocs'],
  args: {
    open: false,
    size: 'xs',
    type: 'confirm',
    title: 'Подтвердить действие',
    message: 'Изменения будут применены к текущему отчёту.',
    labelActiveButton: 'Подтвердить',
    labelCancelButton: 'Отмена',
    autoFocusCancelButton: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['confirm', 'delete'],
    },
    title: { control: 'text' },
    message: { control: 'text' },
    labelActiveButton: { control: 'text' },
    labelCancelButton: { control: 'text' },
    autoFocusCancelButton: { control: 'boolean' },
    content: {
      control: false,
      description: 'Дополнительный контент между заголовком и сообщением',
      table: { type: { summary: 'VNode' } },
    },
  },
  render: (args) => ({
    components: { ButtonBase, DialogConfirm },
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
      <ButtonBase color="primary" @click="model = true; args.open = true">Открыть диалог</ButtonBase>
      <DialogConfirm
        v-bind="args"
        :open="model"
        @update:open="model = $event; args.open = $event"
        @confirm="model = false; args.open = false"
      />
    `,
  }),
} satisfies Meta<typeof DialogConfirm>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Delete: Story = {
  name: 'Удаление',
  args: {
    type: 'delete',
    title: 'Удалить строку?',
    message: 'Это действие нельзя отменить.',
    labelActiveButton: 'Удалить',
  },
}

export const WithContent: Story = {
  name: 'С дополнительным контентом',
  render: (args) => ({
    components: { ButtonBase, DialogConfirm },
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
      <ButtonBase color="primary" @click="model = true; args.open = true">Открыть диалог</ButtonBase>
      <DialogConfirm
        v-bind="args"
        :open="model"
        @update:open="model = $event; args.open = $event"
        @confirm="model = false; args.open = false"
      >
        <template #content>
          <span>Будет затронута выбранная строка отчёта.</span>
        </template>
      </DialogConfirm>
    `,
  }),
}
