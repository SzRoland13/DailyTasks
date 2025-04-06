// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',

      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: '*', next: 'for' },
        { blankLine: 'always', prev: '*', next: 'try' },
        { blankLine: 'always', prev: '*', next: 'switch' },

        { blankLine: 'always', prev: 'return', next: '*' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: 'for', next: '*' },
        { blankLine: 'always', prev: 'try', next: '*' },
        { blankLine: 'always', prev: 'switch', next: '*' },

        { blankLine: 'any', prev: 'case', next: '*' },
        { blankLine: 'any', prev: '*', next: 'case' },

        { blankLine: 'always', prev: 'const', next: '*' },
        { blankLine: 'any', prev: 'const', next: 'const' },
      ],
    },
    settings: {},
  },
  {
    ignores: ['node_modules', 'dist'],
  },
];
