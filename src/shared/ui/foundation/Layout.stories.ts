import type { Meta, StoryObj } from '@storybook/vue3-vite'

const containerPoint = {
  sm: { bp: '640px', container: '600px', bpVarName: '--bp-sm', containerVarName: '--container-sm' },
  md: { bp: '768px', container: '720px', bpVarName: '--bp-md', containerVarName: '--container-md' },
  lg: { bp: '1024px', container: '960px', bpVarName: '--bp-lg', containerVarName: '--container-lg' },
  xl: { bp: '1280px', container: '1120px', bpVarName: '--bp-xl', containerVarName: '--container-xl' },
  '2xl': { bp: '1536px', container: '1200px', bpVarName: '--bp-2xl', containerVarName: '--container-2xl' },
}

const meta = {
  title: 'UI-Утилиты/Layout',
  parameters: {
    docs: {
      description: {
        component:
          'Глобальный класс `Container` и layout-токены из `src/app/styles/variables.css`. История показывает фактическую ширину контейнера, брейкпоинты и правило расчёта итоговой ширины.',
      },
    },
  },
  tags: ['autodocs'],
  render: () => ({
    setup() {
      return { containerPoint }
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <code style="color: var(--color-text-caption);">Container</code>
          <div class="Container">
            <div style="padding: 24px; border-radius: 12px; background: var(--color-background-surface); box-shadow: var(--shadow);">
              <p class="Typo_Title2">Контент внутри Container</p>
              <p class="Typo_Body" style="margin-top: 8px;">
                Этот блок ограничен глобальным классом контейнера и остаётся центрированным внутри полноширинного фона.
              </p>
            </div>
          </div>

        <div style="display: grid; gap: 12px; text-indent: 30px;">
          <p class="Typo_Title1">Как считается контейнер</p>


            <p class="Typo_Title2" style="padding-top: 10px">Боковые отступы</p>
            <code>--container-gutter: clamp(16px, 3vw, 32px);</code>
            <p class="Typo_Body">
              <code>clamp()</code> держит значение в диапазоне: минимум <code>16px</code>, адаптивное значение <code>3vw</code>, максимум <code>32px</code>.
              На узких экранах gutter не станет меньше <code>16px</code>, на широких не вырастет больше <code>32px</code>, а между ними будет равен <code>3%</code> ширины viewport.
            </p>
            <p class="Typo_Title2" style="padding-top: 10px">Брекпоинты и максимальное значение ширины</p>
            <p class="Typo_Body">
              <code>--container-max</code> равно <code>100%</code> до первого брейкпоинта, а дальше подменяется на фиксированный токен через media queries из <code>src/app/styles/variables.css</code>.
            </p>

            <div style="display: grid; gap: 12px;">
              <div style="overflow-x: auto; border-radius: 12px; background: var(--color-background-surface); box-shadow: var(--shadow);">
                <table style="width: 100%; border-collapse: collapse; min-width: 640px; text-align: left;">
                  <thead>
                  <tr style="border-bottom: 1px solid var(--color-border-table-cell);">
                    <th style="padding: 12px 16px;">Размер</th>
                    <th style="padding: 12px 16px;">Breakpoint</th>
                    <th style="padding: 12px 16px;">Значение</th>
                    <th style="padding: 12px 16px;">Container</th>
                    <th style="padding: 12px 16px;">Значение</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(point, name) in containerPoint"
                    :key="name"
                    style="border-bottom: 1px solid var(--color-border-table-cell);"
                  >
                    <td style="padding: 12px 16px;"><code>{{ name }}</code></td>
                    <td style="padding: 12px 16px;"><code>{{ point.bpVarName }}</code></td>
                    <td style="padding: 12px 16px;"><code>{{ point.bp }}</code></td>
                    <td style="padding: 12px 16px;"><code>{{ point.containerVarName }}</code></td>
                    <td style="padding: 12px 16px;"><code>{{ point.container }}</code></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <p class="Typo_Title2" style="padding-top: 10px">Ширина контейнера</p>
            <code>width: min(100% - (var(--container-gutter) * 2), var(--container-max));</code>

            <p class="Typo_Body" style="margin-bottom: 8px;"  >
              <code>100%</code> — доступная ширина родителя, <code>var(--container-gutter) * 2</code> — левый и правый отступы контейнера.
              Выражение <code>100% - (var(--container-gutter) * 2)</code> оставляет внутри вьюпорта место под эти два отступа.
            </p>
            <p class="Typo_Body">
              <code>min(..., var(--container-max))</code> выбирает меньшее значение: контейнер либо занимает доступную ширину с отступами, либо ограничивается текущим максимумом <code>--container-max</code>.
            </p>
          </div>
        </div>
    `,
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  name: 'Обзор',
  parameters: {
    docs: {
      source: {
        code: `
<header class="Container">
  <div>
    <h2 class="Typo_Title2">Контент внутри Container</h2>
    <p class="Typo_Body">
      Этот блок ограничен глобальным классом контейнера и остаётся центрированным.
    </p>
  </div>
</header>

<p>
  width: min(100% - (var(--container-gutter) * 2), var(--container-max));
</p>
        `.trim(),
      },
    },
  },
}
