module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'postcss.config.js'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'prettier',
  ],
  rules: {
    'react-refresh/only-export-components': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-empty-pattern': 0,
    'no-unused-vars': 0,
    'react-refresh/no-refs': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
