module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:svelte/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 1,
    '@typescript-eslint/explicit-module-boundary-types': 1,
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/consistent-type-imports': [
      2,
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
        fixStyle: 'inline-type-imports',
      },
    ],
    'object-shorthand': [2, 'always'],
  },
};
