import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  // Базовый набор файлов, которые ESLint должен обрабатывать в проекте.
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  // За пределами src/shared запрещаем глубокие импорты из shared/lib и shared/ui.
  // Идея: внешний код должен ходить в shared через публичные точки входа.
  {
    name: 'app/no-deep-shared-lib-imports',
    files: ['src/**/*.{vue,ts,mts,tsx}'],
    ignores: ['src/shared/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/shared/lib/*', '@/shared/lib/**', '@/shared/ui/*', '@/shared/ui/**'],
        },
      ],
    },
  },

  // Внутри src/shared запрещаем алиас на сам shared.
  // Идея: код внутри слоя shared должен использовать относительные импорты,
  // а не писать "@/shared/...".
  //
  // Важно: для файлов внутри src/shared/ui это правило сейчас перекрывается
  // следующим блоком ниже, потому что оба используют no-restricted-imports.
  {
    name: 'app/no-shared-alias-inside-shared',
    files: ['src/shared/**/*.{vue,ts,mts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/shared/*', '@/shared/**'],
        },
      ],
    },
  },

  // Внутри shared/ui запрещаем прямые относительные импорты между соседними
  // UI-папками. Идея: если компонент из одной UI-группы нужен другой группе,
  // его нужно брать через index.ts, а не через "../icons/..." и т.п.
  //
  // Важно: этот блок целиком заменяет no-restricted-imports из блока выше
  // для src/shared/ui/**, а не дополняет его.
  {
    name: 'app/shared-ui-cross-folder-imports-via-index',
    files: ['src/shared/ui/**/*.{vue,ts,mts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '../buttons/*',
            '../buttons/**',
            '../display/*',
            '../display/**',
            '../forms/*',
            '../forms/**',
            '../icons/*',
            '../icons/**',
            '../overlays/*',
            '../overlays/**',
          ],
        },
      ],
    },
  },

  // Глобально игнорируем сборочные артефакты.
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // Базовые правила Vue.
  ...pluginVue.configs['flat/essential'],
  // Рекомендованные правила TypeScript для Vue-проекта.
  vueTsConfigs.recommended,

  // Отключает конфликтующие stylistic-правила ESLint в пользу Prettier.
  skipFormatting,
)
