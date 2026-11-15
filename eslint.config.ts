// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { readdirSync } from 'node:fs'
import type { Linter } from 'eslint'

// Слои FSD сверху вниз: слой может импортировать только из слоёв ниже себя.
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
// Слои, разбитые на слайсы (у app и shared слайсов нет, только сегменты).
const FSD_SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities']

const getSlices = (layer: string) =>
  readdirSync(`src/${layer}`, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

const restrictImports = (files: string[], patterns: object[]): Linter.Config => ({
  files,
  rules: { 'no-restricted-imports': ['error', { patterns }] },
})

// Правила импортов FSD. В flat-config одноимённые правила не сливаются (побеждает последнее),
// поэтому каждый слайс получает полный список паттернов.
// Ограничение: проверяются только импорты через алиас `@/`, относительные пути не анализируются.
function createFsdImportRules() {
  return FSD_LAYERS.flatMap((layer, index) => {
    const upperLayers = FSD_LAYERS.slice(0, index)
    const lowerSlicedLayers = FSD_SLICED_LAYERS.filter((l) => FSD_LAYERS.indexOf(l) > index)

    const layerPatterns: object[] = upperLayers.map((upper) => ({
      group: [`@/${upper}`, `@/${upper}/**`],
      message: `Слой ${layer} не может импортировать из вышележащего слоя ${upper}.`,
    }))

    if (lowerSlicedLayers.length > 0) {
      layerPatterns.push({
        regex: `^@/(${lowerSlicedLayers.join('|')})/[^/]+/.+`,
        message: 'Импорт из слайса нижележащего слоя только через его public API (index.ts).',
      })
    }

    if (!FSD_SLICED_LAYERS.includes(layer)) {
      return [restrictImports([`src/${layer}/**`], layerPatterns)]
    }

    return getSlices(layer).map((slice) =>
      restrictImports(
        [`src/${layer}/${slice}/**`],
        [
          ...layerPatterns,
          {
            regex: `^@/${layer}/${slice}(/|$)`,
            message: 'Внутри слайса используйте относительные импорты.',
          },
          {
            regex: `^@/${layer}/(?!${slice}(/|$))[^/]+(?!/@x/${slice}$)(/.*)?$`,
            message: `Кросс-импорт между слайсами слоя ${layer} только через @x/${slice}.`,
          },
        ],
      ),
    )
  })
}

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
  globalIgnores(['**/dist/**', '**/build-preview/**', '**/dist-ssr/**', '**/coverage/**', '**/storybook-static/**']),
  globalIgnores(['!.storybook'], 'Include Storybook Directory'),
  // Базовые правила Vue.
  ...pluginVue.configs['flat/essential'],
  ...storybook.configs['flat/recommended'],
  // Рекомендованные правила TypeScript для Vue-проекта.
  vueTsConfigs.recommended,
  {
    rules: {
      'vue/multi-word-component-names': 'error',
    },
  },
  {
    files: ['src/stories/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  // Границы слоёв и слайсов FSD.
  ...createFsdImportRules(),
  // Отключает конфликтующие stylistic-правила ESLint в пользу Prettier.
  skipFormatting,
)
