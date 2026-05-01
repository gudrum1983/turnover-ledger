import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconAdd } from '@/shared/ui/icons'
import { ButtonBase } from './index'

const meta = {
  title: 'UI-Компоненты/ButtonBase',
  parameters: {
    docs: {
      description: {
        component: 'Описание всего компонента ButtonBase.',
      },
    },
  },
  component: ButtonBase,
  tags: ['autodocs'],
  args: {
    color: undefined,
    default: 'Кнопочка',
  },
  argTypes: {
    color: {
      control: 'select',
    },
    variant: {
      control: 'select',
    },
    size: {
      control: 'select',
    },
    type: {
      control: 'select',
    },
    contentPosition: {
      control: 'select',
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    isIconOnly: {
      control: 'boolean',
    },
    isLoader: {
      control: 'boolean',
    },
    default: {
      control: 'text',
      description: 'Основное текстовое содержимое кнопки',
      table: {
        defaultValue: { summary: '"Нет лейбла"' },
        type: {
          summary: 'VNode',
          detail: 'Лейбл для кнопки',
        },
      },
    },
    icon: {
      control: false,
      description: 'Иконка слева от текста',
      table: {
        type: {
          summary: 'VNode',
          detail: `<template #icon>
  <IconAdd style="width: 18px; height: 18px" />
</template>`,
        },
      },
    },
    'end-icon': {
      control: false,
      description: 'Иконка справа от текста',
      table: {
        type: {
          summary: 'VNode',
          detail: `<template #end-icon>
  <IconAdd style="width: 18px; height: 18px" />
</template>`,
        },
      },
    },
  },
  render: (args) => ({
    components: { ButtonBase },
    setup() {
      return { args }
    },
    template: '<ButtonBase v-bind="args">{{ args.default }}</ButtonBase>',
  }),
} satisfies Meta<typeof ButtonBase>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    color: 'primary',
  },
  name: 'Песочница',
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная история для проверки всех основных пропсов кнопки и подбора подходящей конфигурации.',
      },
    },
  },
}

export const Default: Story = {
  name: 'По умолчанию',
  parameters: {
    docs: {
      description: {
        story:
          'Базовый вариант кнопки со стандартными значениями пропсов. Подходит для основного действия без дополнительных акцентов.',
      },
    },
  },
}

export const Outlined: Story = {
  name: 'Контурная',
  args: {
    variant: 'outlined',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Вариант кнопки без заливки. Подходит для второстепенных действий, которые должны быть заметны, но не конкурировать с основной кнопкой.',
      },
    },
  },
}

export const Disabled: Story = {
  name: 'Неактивная',
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Кнопка в отключенном состоянии. Используется, когда действие временно недоступно, например до заполнения обязательных полей формы.',
      },
    },
  },
}

export const Loading: Story = {
  name: 'С лоадером',
  args: {
    color: 'primary',
    size: 'xs',
    isLoader: true,
    default: 'Рассчитать',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Состояние загрузки для асинхронного действия. Контент кнопки скрывается, но сохраняет исходную ширину, чтобы кнопка не дёргалась.',
      },
    },
  },
}

export const FullWidth: Story = {
  name: 'На всю ширину по центру',
  args: {
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Кнопка растягивается на всю ширину контейнера, а содержимое остаётся выровненным по центру. Подходит для мобильных экранов и узких колонок.',
      },
    },
  },
}

export const FullWidthLeft: Story = {
  name: 'На всю ширину с лева',
  args: {
    fullWidth: true,
    contentPosition: 'left',
    default: 'На всю ширину с лева',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Кнопка на всю ширину контейнера с выравниванием содержимого по левому краю. Подходит для списков действий и строковых интерфейсов.',
      },
    },
  },
}

export const WithIcon: Story = {
  name: 'С иконкой',
  args: {
    color: 'info',
    size: 'lg',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Кнопка с иконкой перед текстом. Используется, когда важно визуально подсветить тип действия, не теряя текстовый лейбл.',
      },
      source: {
        code: `
<ButtonBase color="info" size="lg">
  <template #icon>
    <IconAdd style="width: 18px; height: 18px" />
  </template>
  {{args.default}}
</ButtonBase>
        `,
      },
    },
  },
  render: (args) => ({
    components: { ButtonBase, IconAdd },
    setup() {
      return { args }
    },
    template: `
      <ButtonBase v-bind="args">
        <template #icon>
          <IconAdd style="width: 18px; height: 18px" />
        </template>
        {{args.default}}
      </ButtonBase>
    `,
  }),
}

export const IconOnly: Story = {
  name: 'Только иконка',
  args: {
    isIconOnly: true,
    size: 'lg',
    color: 'info',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Компактный вариант кнопки только с иконкой. Используйте его там, где смысл действия понятен по контексту и задан доступный `aria-label`.',
      },
      source: {
        code: `
<ButtonBase color="info" size="lg" isIconOnly>
  
  Add row
</ButtonBase>
        `,
      },
    },
  },
  render: (args) => ({
    components: { ButtonBase, IconAdd },
    setup() {
      return { args }
    },
    template: `
      <ButtonBase v-bind="args">
        <template #icon>
          <IconAdd style="width: 18px; height: 18px" />
        </template>
      </ButtonBase>
    `,
  }),
}

export const WithoutLabel: Story = {
  name: '❗ Без текста',
  args: {
    color: 'danger',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Некорректный сценарий использования: кнопка рендерится без текстового содержимого.',
      },
    },
  },
  render: (args) => ({
    components: { ButtonBase },
    setup() {
      return { args }
    },
    template: '<ButtonBase v-bind="args" />',
  }),
}

export const IconOnlyWithoutIcon: Story = {
  name: '❗ Только иконка без иконки',
  args: {
    color: 'danger',
    variant: 'outlined',
    isIconOnly: true,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Некорректный сценарий использования: включён режим "только иконка", но иконка в слот не передана.',
      },
    },
  },
  render: (args) => ({
    components: { ButtonBase },
    setup() {
      return { args }
    },
    template: '<ButtonBase v-bind="args" aria-label="Add" />',
  }),
}
