
// eslint.config.mjs
// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Base TypeScript across project
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'reports/**'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier as an ESLint rule (error on formatting issues)
      'prettier/prettier': 'error',

      // Common useful TypeScript rules (tweak to taste)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // Playwright-specific rules only in test files
  {
    files: [
      'features/**/*.ts', // Cucumber step defs + hooks
      'tests/**/*.ts', // Playwright tests (if you have a /tests folder)
      'e2e/**/*.ts', // or any other test root
    ],
    ...playwright.configs['flat/recommended'],
    rules: {
      // Customize Playwright linting to your liking
      // e.g., enforce awaiting Playwright APIs:
      // 'playwright/missing-playwright-await': 'error'
    },
  },

  // Optional: Cucumber-specific rules only in step definitions
  {
    files: ['features/**/step-definitions/**/*.ts'],
    plugins: {
      // plugin uses name 'cucumber' in config
      // eslint-plugin-cucumber (legacy config style) still works when referenced in flat setup via "rules"
    },
    rules: {
      // You can enable selected cucumber rules by their full keys
      // (plugin uses legacy convention; ESLint flat config still accepts rule keys):
      // 'cucumber/async-then': 'error',
      // 'cucumber/expression-type': 'warn',
      // 'cucumber/no-restricted-tags': ['warn', 'wip', 'broken'],
      // 'cucumber/no-arrow-functions': 'off' // allow arrow functions in TS step defs if you prefer
    },
  },
];
