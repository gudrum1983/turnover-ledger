import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

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

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  skipFormatting,
)
