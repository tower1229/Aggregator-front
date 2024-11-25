/**
 * @type import('eslint').Linter.Config
 * @link https://eslint.org/docs/user-guide/configuring
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    es6: true,
    jest: true,
    node: true,
    browser: true,
    mocha: true,
    jasmine: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  rules: {
    // 'jsx-quotes': ['error', 'prefer-double']
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        alphabetize: {
          order: 'asc'
        }
      }
    ]
  }
  // overrides: [
  //   {
  //     files: ['.*.*', '*rc', '*rc.js'],
  //     rules: {
  //       'import/no-commonjs': 'off'
  //     }
  //   }
  // ]
  // settings: {
  //   react: {
  //     pragma: 'React',
  //     // React version. 'detect' automatically picks the version you have installed.
  //     // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
  //     // default to latest and warns if missing
  //     // It will default to 'detect' in the future
  //     version: 'detect',
  //   }
  // }
}
