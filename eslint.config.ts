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

  // Глобально игнорируем сборочные артефакты.
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // Базовые правила Vue.
  ...pluginVue.configs['flat/essential'],
  // Рекомендованные правила TypeScript для Vue-проекта.
  vueTsConfigs.recommended,

  // Отключает конфликтующие stylistic-правила ESLint в пользу Prettier.
  skipFormatting,
)
