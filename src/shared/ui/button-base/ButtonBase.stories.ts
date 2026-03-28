import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconAdd } from '@/shared/ui/icons'
import { ButtonBase } from './index'

const meta = {
  title: 'UI/ButtonBase',
  component: ButtonBase,
  tags: ['autodocs'],
  args: {
    color: 'default',
    variant: 'filled',
    size: 'md',
    type: 'button',
    disabled: false,
    fullWidth: false,
    isIconOnly: false,
    contentPosition: 'center',
    default: 'Кнопочка Жмяк',
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

export const Default: Story = {
  args: {
    default: 'Кнопка по умолчанию',
  },
  render: (args) => ({
    components: { ButtonBase },
    setup() {
      return { args }
    },
    template: '<ButtonBase>{{ args.default }}</ButtonBase>',
  }),
  parameters: {
    docs: {
      source: {
        code: `
<ButtonBase>
  Кнопка по умолчанию
</ButtonBase>
        `.trim(),
      },
    },
  },
}

export const Playground: Story = {}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'default',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    contentPosition: 'center',
  },
}

export const WithoutLabel: Story = {
  args: {
    color: 'danger',
  },
  parameters: {
    controls: {
      disable: true,
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

export const WithIcon: Story = {
  args: {
    color: 'danger',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: `
<ButtonBase v-bind="args">
  <template #icon>
    <IconAdd style="width: 18px; height: 18px" />
  </template>
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
        Add row
      </ButtonBase>
    `,
  }),
}

export const IconOnly: Story = {
  args: {
    isIconOnly: true,
    size: 'xs',
    color: 'danger',
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (args) => ({
    components: { ButtonBase, IconAdd },
    setup() {
      return { args }
    },
    template: `
      <ButtonBase v-bind="args" aria-label="Add">
        <template #icon>
          <IconAdd style="width: 18px; height: 18px" />
        </template>
      </ButtonBase>
    `,
  }),
}

export const IconOnlyWithoutIcon: Story = {
  args: {
    color: 'danger',
    variant: 'outlined',
    isIconOnly: true,
    size: 'xs',
  },
  parameters: {
    controls: {
      disable: true,
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
