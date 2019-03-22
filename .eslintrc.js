module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  rules: {
    'vue/require-prop-types': 'off',
    'vue/attributes-order': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-valid-default-prop': 'off',
    'no-console': process.env.NUXT_ENV_PATH ? 'warn' : 'off',
    'no-debugger': process.env.NUXT_ENV_PATH ? 'warn' : 'off',
    'vue/html-self-closing': 0,
    'prettier/prettier': 0
  }
}
