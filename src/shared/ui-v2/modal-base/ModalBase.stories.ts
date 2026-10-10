import type { Meta, StoryContext, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { ButtonBase } from '../button-base'
import { ModalBase } from './index'

const defaultContent = '<p>Содержимое модального окна передаётся через обычный слот.</p>'
const longContent = `<p v-for="paragraph in 20" :key="paragraph">
  Абзац {{ paragraph }}. Длинное содержимое прокручивается внутри окна, а страница под ним остаётся неподвижной.
</p>`

const createRender =
  (content: string): NonNullable<Meta<typeof ModalBase>['render']> =>
  (args) => ({
    components: { ModalBase, ButtonBase },
    setup() {
      const open = ref(args.open)
      watch(
        () => args.open,
        (value) => {
          open.value = value
        },
      )
      return { args, open }
    },
    template: `<div>
    <ButtonBase @click="open = true">Открыть модалку</ButtonBase>
    <ModalBase v-bind="args" v-model:open="open">
      <div style="display: flex; flex-direction: column; gap: 16px">
        ${content}
        <ButtonBase @click="open = false">Готово</ButtonBase>
      </div>
    </ModalBase>
  </div>`,
  })

const meta = {
  title: 'UI-V2-Компоненты/ModalBase',
  component: ModalBase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Модальное окно с заголовком и слотом содержимого. Откройте окно кнопкой: фокус остаётся внутри, после закрытия возвращается на кнопку открытия.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code: string, { args, parameters }: StoryContext) => {
          const attributes = [
            'v-model:open="open"',
            `title="${args.title}"`,
            ...(args.animateTitle ? ['animate-title'] : []),
            ...(args.hasCloseButton ? ['has-close-button'] : []),
            ...(args.shouldCloseOnOverlay ? ['should-close-on-overlay'] : []),
            ...(args.shouldCloseOnEsc ? ['should-close-on-esc'] : []),
            ...(args.rootClass ? [`root-class="${args.rootClass}"`] : []),
          ]
          return `<ButtonBase @click="open = true">Открыть модалку</ButtonBase>
<ModalBase ${attributes.join(' ')}>
  ${parameters.longContent ? longContent : defaultContent}
  <ButtonBase @click="open = false">Готово</ButtonBase>
</ModalBase>`
        },
      },
    },
  },
  args: {
    open: false,
    title: 'Заголовок модального окна',
    animateTitle: false,
    hasCloseButton: true,
    shouldCloseOnOverlay: true,
    shouldCloseOnEsc: true,
    rootClass: '',
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    animateTitle: { control: 'boolean' },
    hasCloseButton: { control: 'boolean' },
    shouldCloseOnOverlay: { control: 'boolean' },
    shouldCloseOnEsc: { control: 'boolean' },
    rootClass: { control: 'text' },
  },
  render: createRender(defaultContent),
} satisfies Meta<typeof ModalBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
export const WithoutCloseButton: Story = {
  name: 'Без крестика',
  args: { hasCloseButton: false },
}
export const CloseOnEscape: Story = {
  name: 'Закрытие по Escape',
  args: { shouldCloseOnOverlay: false },
}
export const CloseOnOverlay: Story = {
  name: 'Закрытие по фону',
  args: { shouldCloseOnEsc: false },
}
export const ExplicitCloseOnly: Story = {
  name: 'Закрытие только кнопкой',
  args: { hasCloseButton: false, shouldCloseOnOverlay: false, shouldCloseOnEsc: false },
}
export const LongContent: Story = {
  name: 'Длинное содержимое',
  args: { title: 'Окно с прокруткой' },
  parameters: { longContent: true },
  render: createRender(longContent),
}

export const AnimatedTitle: Story = {
  name: 'Анимация смены заголовка',
  args: { animateTitle: true },
  parameters: {
    docs: {
      source: {
        transform: undefined,
        code: `<ModalBase v-model:open="open" :title="title" animate-title has-close-button>
  <ButtonBase @click="toggleTitle">Сменить заголовок</ButtonBase>
</ModalBase>`,
      },
      description: {
        story:
          'Откройте окно и нажмите «Сменить заголовок». Переход включён только при animateTitle; настройка уменьшения анимаций учитывается автоматически.',
      },
    },
  },
  render: (args) => ({
    components: { ModalBase, ButtonBase },
    setup() {
      const open = ref(args.open)
      const title = ref(args.title)
      watch(
        () => args.open,
        (value) => {
          open.value = value
        },
      )
      watch(
        () => args.title,
        (value) => {
          title.value = value
        },
      )
      const toggleTitle = () => {
        title.value = title.value === args.title ? 'Language settings' : args.title
      }
      return { args, open, title, toggleTitle }
    },
    template: `<div>
      <ButtonBase @click="open = true">Открыть модалку</ButtonBase>
      <ModalBase v-bind="args" v-model:open="open" :title="title">
        <ButtonBase @click="toggleTitle">Сменить заголовок</ButtonBase>
      </ModalBase>
    </div>`,
  }),
}
