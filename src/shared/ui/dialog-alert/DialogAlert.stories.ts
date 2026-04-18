import { ref, watch } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ButtonBase } from '@/shared/ui/button-base'
import { DialogAlert } from './index'

const meta = {
  title: 'UI-Компоненты/DialogAlert',
  parameters: {
    docs: {
      description: {
        component:
          'Готовый уведомительный диалог на базе `ModalBase`. Поддерживает типы `info`, `danger`, `success`, одну кнопку закрытия и дополнительный контент.',
      },
    },
  },
  component: DialogAlert,
  tags: ['autodocs'],
  args: {
    open: false,
    size: 'xs',
    type: 'info',
    title: 'Информационное сообщение',
    message: 'Операция завершена, проверьте детали перед следующим действием.',
    labelCloseButton: 'Закрыть',
    autoFocusCloseButton: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['info', 'danger', 'success'],
    },
    title: { control: 'text' },
    message: { control: 'text' },
    labelCloseButton: { control: 'text' },
    autoFocusCloseButton: { control: 'boolean' },
    content: {
      control: false,
      description: 'Дополнительный контент между заголовком и сообщением',
      table: { type: { summary: 'VNode' } },
    },
  },
  render: (args) => ({
    components: { ButtonBase, DialogAlert },
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
      <DialogAlert
        v-bind="args"
        :open="model"
        @update:open="model = $event; args.open = $event"
      />
    `,
  }),
} satisfies Meta<typeof DialogAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Песочница',
}

export const Info: Story = {
  name: 'Info',
  args: {
    type: 'info',
    title: 'Импорт завершён',
    message: 'Данные были успешно прочитаны и готовы к дальнейшей проверке.',
  },
}

export const Danger: Story = {
  name: 'Danger',
  args: {
    type: 'danger',
    title: 'Ошибка импорта',
    message: 'Не удалось обработать файл. Проверьте формат и попробуйте снова.',
  },
}

export const Success: Story = {
  name: 'Success',
  args: {
    type: 'success',
    title: 'Данные сохранены',
    message: 'Все изменения успешно применены к текущему отчёту.',
  },
}

export const WithContent: Story = {
  name: 'С дополнительным контентом',
  render: (args) => ({
    components: { ButtonBase, DialogAlert },
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
      <DialogAlert
        v-bind="args"
        :open="model"
        @update:open="model = $event; args.open = $event"
      >
        <template #content>
          <span>Файл: turnover-ledger-2026-04-18.json</span>
        </template>
      </DialogAlert>
    `,
  }),
}
