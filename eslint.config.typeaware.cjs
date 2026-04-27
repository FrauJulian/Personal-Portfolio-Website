/** @type {import('eslint').Linter.FlatConfig[]} */
const base = require('./eslint.config.js');

const typeAwareLayer = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      project: ['./tsconfig.eslint.json', './tsconfig.spec.json', './backend/tsconfig.json'],
      tsconfigRootDir: __dirname,
    },
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
  },
};

module.exports = [...base, typeAwareLayer];
